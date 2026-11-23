import { encodeForQuery } from "@shopware/api-client/helpers";
import {
  getCategoryFilterAggregations,
  getCategoryFilterPostFilter,
} from "@shopware/helpers";
import { cacheLife, cacheTag } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { searchListing } from "@/features/search/search.fixture";
import { apiClientError } from "@/features/session/session.fixture";

import { createShopwareClient } from "../client";
import { productSearchCriteria, readProductSearch } from "./productSearch";

vi.mock("server-only", () => ({}));

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock("../client", () => ({
  createShopwareClient: vi.fn(),
}));

const invoke = vi.fn();

const SEARCH = "searchPageGet get /search";

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createShopwareClient).mockReturnValue({
    invoke,
  } as unknown as ReturnType<typeof createShopwareClient>);
});

describe("productSearchCriteria", () => {
  it("asks for the category filter aggregations", () => {
    expect(productSearchCriteria([])).toEqual({
      aggregations: getCategoryFilterAggregations(),
    });
  });

  it("narrows the results to the chosen categories with a post-filter", () => {
    expect(productSearchCriteria(["category-a", "category-b"])).toEqual({
      aggregations: getCategoryFilterAggregations(),
      "post-filter": [
        getCategoryFilterPostFilter(["category-a", "category-b"]),
      ],
    });
  });
});

describe("readProductSearch", () => {
  it("reads the GET search in the page language with the listing parameters in the plain query", async () => {
    const listing = searchListing();
    invoke.mockResolvedValue({ data: listing, status: 200 });

    await expect(
      readProductSearch(
        "shirt",
        { p: 2, limit: 1, order: "price-asc", manufacturer: "maker-1" },
        [],
        "language-de",
      ),
    ).resolves.toBe(listing);

    expect(createShopwareClient).toHaveBeenCalledExactlyOnceWith({
      languageId: "language-de",
    });
    expect(invoke).toHaveBeenCalledExactlyOnceWith(SEARCH, {
      headers: { "sw-include-seo-urls": true },
      query: {
        p: 2,
        limit: 1,
        order: "price-asc",
        manufacturer: "maker-1",
        search: "shirt",
        _criteria: encodeForQuery({
          aggregations: getCategoryFilterAggregations(),
        }),
      },
    });
    expect(cacheLife).toHaveBeenCalledExactlyOnceWith("listing");
    expect(cacheTag).toHaveBeenCalledExactlyOnceWith(
      "sw:search",
      "sw:search:language-de",
    );
  });

  it("sends the category post-filter inside _criteria and tags only the search without a language", async () => {
    invoke.mockResolvedValue({ data: searchListing(), status: 200 });

    await readProductSearch("shirt", { p: 1 }, ["category-a"], null);

    expect(createShopwareClient).toHaveBeenCalledExactlyOnceWith({
      languageId: null,
    });
    const [, params] = invoke.mock.calls[0] ?? [];
    expect(params.query).toEqual({
      p: 1,
      search: "shirt",
      _criteria: encodeForQuery({
        aggregations: getCategoryFilterAggregations(),
        "post-filter": [getCategoryFilterPostFilter(["category-a"])],
      }),
    });
    expect(cacheTag).toHaveBeenCalledExactlyOnceWith("sw:search");
  });

  it("lets a failed read reach the caller so it is not cached", async () => {
    const outOfRange = apiClientError(
      [{ code: "PRODUCT__LISTING_PAGE_OUT_OF_RANGE" }],
      404,
    );
    invoke.mockRejectedValue(outOfRange);

    await expect(readProductSearch("shirt", { p: 9 }, [], null)).rejects.toBe(
      outOfRange,
    );
  });
});
