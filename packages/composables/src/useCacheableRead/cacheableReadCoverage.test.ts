import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

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

const scannedDirs = [
  "packages/composables/src",
  "packages/cms-base-layer/app",
  "templates/vue-starter-template/app",
  "templates/vue-starter-template-extended/app",
];

// the helper itself and the files that define the flag
const skippedFiles =
  /\.(test|spec)\.ts$|useCacheableRead[/\\]|createShopwareContext\.ts$|useShopwareContext\.ts$/;

const getTwin = (post: string) => post.replace(/^(\w+) post /, "$1Get get ");

const operationKeys = new Set(
  readFileSync(
    join(root, "packages/api-client/api-types/storeApiTypes.d.ts"),
    "utf8",
  ).match(/(?<=")\w+ (?:get|post) \/[^"]*(?=":)/g),
);

const twins = [...operationKeys].filter(
  (key) => key.includes(" post ") && operationKeys.has(getTwin(key)),
);

const forbiddenKeys = [
  ...Object.keys(cacheableReadRoutes),
  ...twins.map(getTwin),
];

function findBypasses(source: string) {
  const rest = source.replace(/(invokeRead\(|operations\[)\s*"[^"]+"/g, "");
  const bypasses = forbiddenKeys.filter((key) => rest.includes(`"${key}"`));
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

  it("sends every cacheable read through invokeRead", () => {
    const bypasses = scannedDirs.flatMap((dir) =>
      readdirSync(join(root, dir), { recursive: true, encoding: "utf8" })
        .filter((file) => /\.(ts|vue)$/.test(file) && !skippedFiles.test(file))
        .flatMap((file) => {
          const source = readFileSync(join(root, dir, file), "utf8")
            // drop comment lines, so commented-out code does not count
            .replace(/^\s*(\/\/|\/\*|\*).*$/gm, "");
          return findBypasses(source).map((key) => `${dir}/${file}: ${key}`);
        }),
    );

    expect(
      bypasses,
      "Register the route in cacheableReadRoutes. Call invokeRead with its POST operation.",
    ).toEqual([]);
  });
});
