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
  const reason = entry.failure ?? entry.cause ?? `status ${entry.status}`;
  const key = `${entry.kind} | ${endpoint(entry.url)} | ${reason}`;
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]);
console.log(`### Network failures (${entries.length} total)\n`);
console.log("| count | kind | endpoint | reason |");
console.log("| ---: | --- | --- | --- |");
for (const [key, count] of rows) {
  const [kind, path, reason] = key.split(" | ");
  console.log(`| ${count} | ${kind} | \`${path}\` | ${reason} |`);
}
console.log(
  "\n`store-api-no-response` with `net::ERR_ABORTED` is usually the client cancelling on navigation, not the backend. `net::ERR_FAILED` and any `storefront-5xx` are the ones worth reporting upstream.",
);
