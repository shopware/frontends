import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { cacheableReadRoutes } from "./useCacheableRead";

const root = resolve(import.meta.dirname, "../../../..");

const postOnlyReads: Record<string, string> = {
  "contextGateway post /context/gateway": "app gateway, changes the context",
  "download post /document/download/{documentId}/{deepLinkCode}":
    "customer document",
  "getEmployeeContexts post /employee/context": "B2B, per employee",
  "handlePaymentMethod post /handle-payment": "payment flow, not a read",
  "readBudget post /budget/{id}": "B2B, per customer",
  "readBudgets post /budgets": "B2B, per customer",
  "readCms post /cms/{id}": "not migrated yet",
  "readCountryState post /country-state/{countryId}": "not migrated yet",
  "readCurrency post /currency": "not migrated yet",
  "readLandingPage post /landing-page/{landingPageId}": "not migrated yet",
  "readMedia post /media": "not migrated yet",
  "readPaymentMethod post /payment-method": "depends on the cart and customer",
  "readProductCrossSellings post /product/{productId}/cross-selling":
    "not migrated yet",
  "readProductListing post /product-listing/{categoryId}": "#2691",
  "readShippingMethod post /shipping-method":
    "depends on the cart and customer",
  "searchPage post /search": "#2691",
  "searchProductVariantIds post /product/{productId}/find-variant":
    "not migrated yet",
  "searchQuoteProducts post /quote/{quoteId}/product-search":
    "B2B, per customer",
  "searchSuggest post /search-suggest": "not migrated yet",
};

const manifest: { templates: { id: string; supportLevel: string }[] } =
  JSON.parse(readFileSync(join(root, "templates/manifest.json"), "utf8"));

// deprecated templates, like vue-demo-store (#2667), are out of scope
const scannedDirs = [
  "packages/composables/src",
  "packages/cms-base-layer/app",
  ...manifest.templates
    .filter((template) => template.supportLevel !== "deprecated")
    .map((template) => `templates/${template.id}`),
];

// the helper itself and the files that define the flag
const skippedFiles =
  /\.(test|spec)\.ts$|useCacheableRead[/\\]|createShopwareContext\.ts$|useShopwareContext\.ts$|nuxt\.config\.ts$/;

const skippedDirs = new Set(["node_modules", ".nuxt", ".output", "dist"]);

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return skippedDirs.has(entry.name) ? [] : sourceFiles(path);
    }
    return /\.(ts|vue|astro)$/.test(path) && !skippedFiles.test(path)
      ? [path]
      : [];
  });
}

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

const forbiddenKeys = [
  ...Object.keys(cacheableReadRoutes),
  ...twins.map(getTwin),
];

const quotes = ['"', "'", "`"];

function findBypasses(source: string) {
  const rest = source.replace(
    /(invokeRead\(|operations\[)\s*["'`][^"'`]+["'`]/g,
    "",
  );
  const bypasses = forbiddenKeys.filter((key) =>
    quotes.some((quote) => rest.includes(quote + key + quote)),
  );
  if (/\bcacheableReads\b/.test(source)) bypasses.push("cacheableReads");
  return bypasses;
}

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

  it("sends every cacheable read through invokeRead", () => {
    const bypasses = scannedDirs
      .flatMap((dir) => sourceFiles(join(root, dir)))
      .flatMap((file) => {
        const source = readFileSync(file, "utf8")
          // drop comment lines, so commented-out code does not count
          .replace(/^\s*(\/\/|\/\*|\*).*$/gm, "");
        return findBypasses(source).map(
          (key) => `${relative(root, file)}: ${key}`,
        );
      });

    expect(
      bypasses,
      "Register the route in cacheableReadRoutes. Call invokeRead with its POST operation.",
    ).toEqual([]);
  });
});
