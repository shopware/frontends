import { describe, expect, it } from "vitest";

import { buildSearchListingQuery } from "./searchListingQuery";

const SHIRTS = "0190a1b2c3d4e5f60718293a4b5c6d7e";
const CHAIRS = "0190A1B2C3D4E5F60718293A4B5C6D7F";

describe("buildSearchListingQuery", () => {
  it("passes the listing parameters of the URL through", () => {
    expect(
      buildSearchListingQuery({
        search: "shirt",
        p: "2",
        limit: "1",
        order: "price-asc",
        manufacturer: "maker-1|maker-2",
        properties: "red",
        "min-price": "10",
        "max-price": "50",
        rating: "4",
        "shipping-free": "true",
      }),
    ).toEqual({
      query: {
        p: 2,
        limit: 1,
        order: "price-asc",
        manufacturer: "maker-1|maker-2",
        properties: "red",
        "min-price": 10,
        "max-price": 50,
        rating: 4,
        "shipping-free": true,
      },
      categoryIds: [],
    });
  });

  it("leaves the page size and the sorting to the backend", () => {
    expect(buildSearchListingQuery({ search: "shirt" })).toEqual({
      query: { p: 1 },
      categoryIds: [],
    });
  });

  it("keeps only category ids shaped like Shopware ids", () => {
    expect(
      buildSearchListingQuery({
        search: "shirt",
        categories: `${SHIRTS}|not-an-id|${CHAIRS}|${SHIRTS}x`,
      }).categoryIds,
    ).toEqual([SHIRTS, CHAIRS]);
  });

  it("never sends the term or the categories as listing parameters", () => {
    const { query } = buildSearchListingQuery({
      search: "shirt",
      categories: SHIRTS,
    });

    expect(query).not.toHaveProperty("search");
    expect(query).not.toHaveProperty("categories");
  });
});
