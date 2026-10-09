import { describe, expect, it } from "vitest";

import {
  buildListingQuery,
  buildListingQueryParams,
  createEmptyFilterState,
  getVisibleListingFilters,
  hasActiveFilters,
  hasListingQuery,
  parseListingState,
} from "./query";

describe("parseListingState", () => {
  it("parses the Vue layer's URL contract", () => {
    const state = parseListingState({
      manufacturer: "a|b",
      properties: ["c", "ignored"],
      "min-price": "10",
      "max-price": "abc",
      rating: "4",
      "shipping-free": "true",
      order: "price-asc",
      limit: "24",
      p: "3",
    });

    expect(state.filters.manufacturer).toEqual(["a", "b"]);
    expect(state.filters.properties).toEqual(["c"]);
    expect(state.filters["min-price"]).toBe(10);
    expect(state.filters["max-price"]).toBeUndefined();
    expect(state.filters.rating).toBe(4);
    expect(state.filters["shipping-free"]).toBe(true);
    expect(state.order).toBe("price-asc");
    expect(state.limit).toBe(24);
    expect(state.page).toBe(3);
  });
});

describe("buildListingQuery", () => {
  it("round-trips through the parser and drops empty values", () => {
    const state = parseListingState({
      manufacturer: "a|b",
      rating: "4",
      order: "name-desc",
      limit: "15",
      p: "2",
      categories: "x",
      search: "chair",
    });
    const query = buildListingQuery(state);

    expect(query.get("manufacturer")).toBe("a|b");
    expect(query.get("rating")).toBe("4");
    expect(query.get("order")).toBe("name-desc");
    expect(query.get("limit")).toBe("15");
    expect(query.get("p")).toBe("2");
    expect(query.has("properties")).toBe(false);
    expect(query.has("categories")).toBe(false);
    expect(query.has("search")).toBe(false);
    expect(parseListingState(Object.fromEntries(query))).toEqual({
      ...state,
      filters: { ...state.filters, categories: [] },
      search: undefined,
    });
  });

  it("keeps an explicit first page in the query", () => {
    const query = buildListingQuery({
      filters: createEmptyFilterState(),
      limit: 1,
      page: 1,
    });

    expect(query.get("p")).toBe("1");
    expect(
      buildListingQuery({ filters: createEmptyFilterState() }).has("p"),
    ).toBe(false);
  });

  it("keeps the category filter and search term for product search", () => {
    const query = buildListingQuery(
      parseListingState({ categories: "x", search: "chair" }),
      { isProductSearch: true },
    );
    expect(query.get("categories")).toBe("x");
    expect(query.get("search")).toBe("chair");
  });
});

describe("buildListingQueryParams", () => {
  it("sends only the page when the URL sets no limit or order, so the backend applies its listing defaults", () => {
    expect(buildListingQueryParams({})).toEqual({ p: 1 });
  });

  it("uses the given defaults for the values the URL leaves out", () => {
    expect(
      buildListingQueryParams({ p: "2" }, { limit: 24, order: "topseller" }),
    ).toEqual({ p: 2, limit: 24, order: "topseller" });
  });

  it("prefers the URL over the defaults and converts strings to numbers and booleans", () => {
    expect(
      buildListingQueryParams(
        {
          manufacturer: "m",
          "min-price": "5",
          "shipping-free": "true",
          limit: "30",
          order: "price-asc",
          p: "2",
        },
        { limit: 24, order: "name-asc" },
      ),
    ).toEqual({
      limit: 30,
      p: 2,
      order: "price-asc",
      manufacturer: "m",
      "min-price": 5,
      "shipping-free": true,
    });
  });
});

describe("hasActiveFilters", () => {
  it("counts the category filter only for product search", () => {
    const state = parseListingState({ categories: "x" });
    expect(hasActiveFilters(state.filters)).toBe(false);
    expect(hasActiveFilters(state.filters, { isProductSearch: true })).toBe(
      true,
    );
  });
});

describe("hasListingQuery", () => {
  it("detects any listing parameter", () => {
    expect(hasListingQuery({})).toBe(false);
    expect(hasListingQuery({ foo: "bar" })).toBe(false);
    expect(hasListingQuery({ p: "2" })).toBe(true);
  });
});

describe("getVisibleListingFilters", () => {
  it("hides the category filter on category listings", () => {
    const filters = [{ code: "manufacturer" }, { code: "categories" }];
    expect(
      getVisibleListingFilters(filters, { isProductSearch: false }),
    ).toEqual([{ code: "manufacturer" }]);
    expect(getVisibleListingFilters(filters, { isProductSearch: true })).toBe(
      filters,
    );
    expect(getVisibleListingFilters(null, { isProductSearch: false })).toEqual(
      [],
    );
  });
});
