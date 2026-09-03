import { readFileSync, existsSync } from "node:fs";

const LOG = "diagnostics/network-failures.jsonl";
if (!existsSync(LOG)) {
  console.log("No network failures recorded.");
  process.exit(0);
}

const entries = readFileSync(LOG, "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));

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

const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]);
console.log(`### Network failures (${entries.length} total)\n`);

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
