import { describe, expect, it } from "vitest";

import { getVisibleListingFilters } from "./listingFilters";

describe("getVisibleListingFilters", () => {
  const filters = [
    { code: "manufacturer" },
    { code: "categories" },
    { code: "price" },
  ];

  it("should keep the categories filter on a search listing", () => {
    expect(
      getVisibleListingFilters(filters, { isProductSearch: true }),
    ).toStrictEqual(filters);
  });

  it("should drop the categories filter on a non-search listing", () => {
    expect(
      getVisibleListingFilters(filters, { isProductSearch: false }),
    ).toStrictEqual([{ code: "manufacturer" }, { code: "price" }]);
  });

  it("should leave listings without a categories filter untouched", () => {
    const withoutCategories = [{ code: "manufacturer" }, { code: "rating" }];
    expect(
      getVisibleListingFilters(withoutCategories, { isProductSearch: false }),
    ).toStrictEqual(withoutCategories);
  });

  it("should return an empty array for missing filters", () => {
    expect(
      getVisibleListingFilters(undefined, { isProductSearch: true }),
    ).toStrictEqual([]);
    expect(
      getVisibleListingFilters(null, { isProductSearch: false }),
    ).toStrictEqual([]);
  });
});
