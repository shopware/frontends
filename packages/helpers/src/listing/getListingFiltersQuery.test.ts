import { describe, expect, it } from "vitest";

import { getListingFiltersQuery } from "./getListingFiltersQuery";

describe("getListingFiltersQuery", () => {
  it("joins array values with a pipe", () => {
    expect(
      getListingFiltersQuery({
        manufacturer: ["m1", "m2"],
        properties: ["p1"],
      }),
    ).toEqual({ manufacturer: "m1|m2", properties: "p1" });
  });

  it("keeps truthy scalar values as they are", () => {
    expect(
      getListingFiltersQuery({
        limit: 10,
        page: 1,
        order: "name-asc",
        "shipping-free": true,
      }),
    ).toEqual({
      limit: 10,
      page: 1,
      order: "name-asc",
      "shipping-free": true,
    });
  });

  it("leaves out empty arrays and falsy values", () => {
    expect(
      getListingFiltersQuery({
        manufacturer: [],
        search: "",
        "min-price": 0,
        "shipping-free": false,
        rating: undefined,
        order: null,
      }),
    ).toEqual({});
  });
});
