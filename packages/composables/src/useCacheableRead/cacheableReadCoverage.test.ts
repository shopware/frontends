import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { cacheableReadRoutes, postOnlyReads } from "./routes";

const root = resolve(import.meta.dirname, "../../../..");

const getTwin = (post: string) => post.replace(/^(\w+) post /, "$1Get get ");

const storeApiTypes = readFileSync(
  join(root, "packages/api-client/api-types/storeApiTypes.d.ts"),
  "utf8",
);

const operationKeys = new Set(
  storeApiTypes.match(/(?<=")\w+ (?:get|post) \/[^"]*(?=":)/g),
);

function operationType(key: string) {
  const start = storeApiTypes.indexOf(`\n  "${key}": {`);
  return storeApiTypes.slice(start, storeApiTypes.indexOf('\n  "', start + 1));
}

const twins = [...operationKeys].filter(
  (key) => key.includes(" post ") && operationKeys.has(getTwin(key)),
);

describe("cacheable reads coverage", () => {
  it("classifies every POST read that has a GET twin", () => {
    expect(
      [
        ...Object.keys(cacheableReadRoutes),
        ...Object.keys(postOnlyReads),
      ].sort(),
    ).toEqual(twins.sort());
  });

  it("maps plain query params for a GET twin without _criteria", () => {
    const unmapped = Object.values(cacheableReadRoutes)
      .filter((route) => !("query" in route))
      .map((route) => route.get)
      .filter((get) => !operationType(get).includes("_criteria"));

    expect(
      unmapped,
      "This GET route may ignore _criteria. List the body keys it reads as plain params in `query`.",
    ).toEqual([]);
  });
});
