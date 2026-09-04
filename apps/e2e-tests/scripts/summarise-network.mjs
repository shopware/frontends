import { readFileSync, existsSync } from "node:fs";

const LOG = "diagnostics/network-failures.jsonl";
const ATTEMPTS = "diagnostics/store-api-attempts.log";
const SSR_LOG = "diagnostics/ssr-network.jsonl";
if (!existsSync(LOG)) {
  console.log("No network failures recorded.");
  process.exit(0);
}

const readJsonl = (path) =>
  existsSync(path)
    ? readFileSync(path, "utf8")
        .split("\n")
        .filter(Boolean)
        .map((l) => JSON.parse(l))
    : [];

// Browser side, from the Playwright fixture.
const browser = readJsonl(LOG).map((entry) => ({ side: "browser", ...entry }));
const browserOk = existsSync(ATTEMPTS)
  ? readFileSync(ATTEMPTS, "utf8").split("\n").filter(Boolean).length
  : 0;

// SSR side, from the fetch wrapper loaded into the storefront's own process.
// Without it, calls made while rendering are invisible, and those are the ones
// that turn into a 500 page.
const ssr = readJsonl(SSR_LOG);
const ssrOk = ssr.filter((entry) => entry.kind === "store-api-ok").length;

const completed = browserOk + ssrOk;
const entries = [...browser, ...ssr.filter((e) => e.kind !== "store-api-ok")];

const endpoint = (url) =>
  (url.split("/store-api/")[1] ?? url)
    .split("?")[0]
    .replace(/[0-9a-f]{32}/g, "{id}");

const counts = new Map();
for (const entry of entries) {
  if (entry.kind === "storefront-error-page") continue;
  const reason = entry.failure ?? entry.cause ?? `status ${entry.status}`;
  const key = `${entry.kind} | ${endpoint(entry.url)} | ${reason}`;
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

const durations = entries
  .map((entry) => entry.ms)
  .filter((ms) => typeof ms === "number")
  .sort((a, b) => a - b);

const errorPages = entries.filter(
  (entry) => entry.kind === "storefront-error-page",
);
const throttled = entries.filter(
  (entry) => entry.kind === "store-api-throttled",
);

const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]);
// A 4xx is the backend answering, not the connection failing. Counting those
// as failures would inflate the number that matters, and some are expected:
// /customer/wishlist 404s by design for a customer without one.
const answered = entries.filter((entry) =>
  String(entry.kind).startsWith("store-api-4"),
);
const transport = entries.filter(
  (entry) => !String(entry.kind).startsWith("store-api-4"),
);
// Two kinds of failure are ours, not the backend's, and both would inflate the
// number if counted: ERR_ABORTED is the client cancelling in flight, and
// anything after the test body has finished is Playwright closing the context
// on requests still in flight.
const aborted = transport.filter(
  (entry) => entry.failure === "net::ERR_ABORTED" || entry.duringTeardown,
);
const genuine = transport.filter(
  (entry) => entry.failure !== "net::ERR_ABORTED" && !entry.duringTeardown,
);
const attempted = completed + entries.length;
const pct = (n) => (attempted ? ((n / attempted) * 100).toFixed(1) : "0");
const bySide = (list, side) => list.filter((e) => e.side === side).length;
console.log(
  `### Store API: ${genuine.length} of ${attempted} calls failed without a response (${pct(genuine.length)}%)\n`,
);
console.log(
  `Browser ${bySide(genuine, "browser")} of ${browserOk + browser.length}, SSR ${bySide(genuine, "ssr")} of ${ssrOk + ssr.length - ssrOk}. SSR is measured by a fetch wrapper in the storefront process; without it those calls are invisible and are the ones that become 500 pages.\n`,
);
if (aborted.length) {
  console.log(
    `A further ${aborted.length} (${pct(aborted.length)}%) were ours rather than the backend's, either \`net::ERR_ABORTED\` or in flight when the test closed its context. Excluded above.\n`,
  );
}
if (answered.length) {
  const byKind = new Map();
  for (const entry of answered) {
    byKind.set(entry.kind, (byKind.get(entry.kind) ?? 0) + 1);
  }
  console.log(
    `Plus ${answered.length} answered with a 4xx, listed below but not counted above: ${[...byKind.entries().map(([k, v]) => `${v}x ${k}`)].join(", ")}.\n`,
  );
}

if (throttled.length) {
  const traces = throttled
    .map((entry) => entry.traceId)
    .filter(Boolean)
    .slice(0, 5);
  console.log(
    `**${throttled.length} request(s) were rate limited (429).** The Store API limit is shared across endpoints, so this points at our own traffic shape rather than a backend fault.\n`,
  );
  if (traces.length) {
    console.log(`Trace ids for correlation: ${traces.join(", ")}\n`);
  }
}

if (errorPages.length) {
  console.log(
    `**${errorPages.length} error page(s) shown to the browser.** These are the severe ones: the visitor got a blank error instead of the shop.\n`,
  );
  const byCause = new Map();
  for (const page of errorPages) {
    const key = `${page.status} | ${page.cause ?? page.message}`;
    byCause.set(key, (byCause.get(key) ?? 0) + 1);
  }
  console.log("| count | status | cause |");
  console.log("| ---: | --- | --- |");
  for (const [key, count] of [...byCause.entries()].sort(
    (a, b) => b[1] - a[1],
  )) {
    const [status, cause] = key.split(" | ");
    console.log(`| ${count} | ${status} | \`${cause}\` |`);
  }
  console.log("");
}
console.log("| count | kind | endpoint | reason |");
console.log("| ---: | --- | --- | --- |");
for (const [key, count] of rows) {
  const [kind, path, reason] = key.split(" | ");
  console.log(`| ${count} | ${kind} | \`${path}\` | ${reason} |`);
}
const nodes = existsSync(ATTEMPTS)
  ? readFileSync(ATTEMPTS, "utf8").split("\n").filter(Boolean)
  : [];
const byNode = new Map();
for (const node of nodes) byNode.set(node, (byNode.get(node) ?? 0) + 1);
if (byNode.size > 1) {
  console.log("\nAnswers per backend node:\n");
  console.log("| node | answered |");
  console.log("| --- | ---: |");
  for (const [node, count] of [...byNode.entries()].sort(
    (a, b) => b[1] - a[1],
  )) {
    console.log(`| \`${node}\` | ${count} |`);
  }
  console.log("");
}

const sample = genuine.slice(0, 8);
if (sample.length) {
  console.log("\nSample for log correlation:\n");
  console.log("| when (UTC) | endpoint | error | preceding trace id | node |");
  console.log("| --- | --- | --- | --- | --- |");
  for (const entry of sample) {
    console.log(
      `| ${entry.at ?? "?"} | \`${endpoint(entry.url)}\` | ${entry.failure ?? entry.status} | \`${entry.precededBy?.traceId ?? "-"}\` | \`${entry.precededBy?.node ?? "-"}\` |`,
    );
  }
  console.log("");
}

const ssrOkMs = ssr
  .filter(
    (entry) => entry.kind === "store-api-ok" && typeof entry.ms === "number",
  )
  .map((entry) => entry.ms)
  .sort((a, b) => a - b);
if (ssrOkMs.length) {
  const at = (q) =>
    ssrOkMs[Math.min(ssrOkMs.length - 1, Math.floor(ssrOkMs.length * q))];
  const slow = ssrOkMs.filter((ms) => ms > 3000).length;
  console.log(
    `\nSSR call latency: median ${at(0.5)}ms, p90 ${at(0.9)}ms, p99 ${at(0.99)}ms, max ${ssrOkMs.at(-1)}ms. ${slow} took over 3s.`,
  );
  console.log(
    "A slow render looks identical to a broken one from a test's point of view, so this is what separates 'the backend failed' from 'the backend was late'.\n",
  );
}

if (durations.length) {
  const at = (q) =>
    durations[Math.min(durations.length - 1, Math.floor(durations.length * q))];
  console.log(
    `\nTime to failure: min ${durations[0]}ms, median ${at(0.5)}ms, p90 ${at(0.9)}ms, max ${durations.at(-1)}ms.`,
  );
  console.log(
    "Values clustered near a round number point at a timeout in the chain. Values near zero point at connections dropped outright, for instance a reused keep-alive the other side had already closed.",
  );
}

console.log(
  "\n`store-api-no-response` with `net::ERR_ABORTED` is usually the client cancelling on navigation, not the backend. `net::ERR_FAILED` and any `storefront-5xx` are the ones worth reporting upstream.",
);
