import { describe, expect, it } from "vitest";

import { fakeClient } from "@/features/checkout/checkout.fixture";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";
import { apiClientError } from "@/features/session/session.fixture";

import { suggestProduct } from "./search.fixture";
import { readSearchSuggest } from "./searchSuggestApi";

const SUGGEST = "searchSuggestGet get /search-suggest";

describe("readSearchSuggest", () => {
  it("reads ten suggestions over GET with SEO URLs, no aggregations and the read timeout", async () => {
    const products = [suggestProduct()];
    const { client, invocations } = fakeClient(() => ({
      elements: products,
      total: 12,
    }));
    const { signal } = new AbortController();

    await expect(readSearchSuggest(client, "shirt", signal)).resolves.toEqual({
      products,
      total: 12,
    });

    expect(invocations).toEqual([
      {
        operation: SUGGEST,
        params: {
          headers: { "sw-include-seo-urls": true },
          query: { search: "shirt", limit: 10, "no-aggregations": "1" },
          fetchOptions: { timeout: READ_TIMEOUT_MS, signal },
        },
      },
    ]);
  });

  it("reads an answer without elements or total as no suggestions", async () => {
    const { client } = fakeClient(() => ({}));

    await expect(readSearchSuggest(client, "shirt")).resolves.toEqual({
      products: [],
      total: 0,
    });
  });

  it("lets a failed read reach the caller", async () => {
    const failure = apiClientError([{ code: "FRAMEWORK__INVALID_CRITERIA" }]);
    const { client } = fakeClient(() => {
      throw failure;
    });

    await expect(readSearchSuggest(client, "shirt")).rejects.toBe(failure);
  });
});
