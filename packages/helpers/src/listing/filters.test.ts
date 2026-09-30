import { describe, expect, it } from "vitest";

import { getListingFilters } from "./filters";

describe("getListingFilters", () => {
  it("should return an empty array if aggregations is undefined", () => {
    const result = getListingFilters(undefined);
    expect(result).toEqual([]);
  });

  it("should return an empty array if aggregations is null", () => {
    const result = getListingFilters(null);
    expect(result).toEqual([]);
  });

  it("should return transformed filters", () => {
    const aggregations = {
      rating: {
        name: "rating",
        max: "5",
        apiAlias: "rating_aggregation",
      },
      price: {
        name: "price",
        min: "3.2000",
        max: "350.0000",
        avg: null,
        sum: null,
        apiAlias: "price_aggregation",
      },
    };

    const result = getListingFilters(aggregations);

    expect(result).toEqual([
      {
        code: "rating",
        label: "rating",
        max: "5",
        name: "rating",
        apiAlias: "rating_aggregation",
      },
      {
        code: "price",
        label: "price",
        min: "3.2000",
        max: "350.0000",
        avg: null,
        sum: null,
        name: "price",
        apiAlias: "price_aggregation",
      },
    ]);
  });

  it("should transform eneities aggregation", () => {
    const aggregations = {
      manufacturer: {
        name: "manufacturer",
        apiAlias: "manufacturer_aggregation",
        entities: [
          {
            name: "Apple",
            id: "123",
            translated: {
              name: "Apple",
            },
          },
        ],
      },
    };

    const result = getListingFilters(aggregations);
    expect(result).toEqual([
      {
        code: "manufacturer",
        label: "manufacturer",
        name: "manufacturer",
        apiAlias: "manufacturer_aggregation",
        entities: [
          {
            name: "Apple",
            id: "123",
            translated: {
              name: "Apple",
            },
          },
        ],
      },
    ]);
  });

  it("should merge categories and categories-counts aggregations into one filter", () => {
    const aggregations = {
      categories: {
        name: "categories",
        apiAlias: "categories_aggregation",
        entities: [
          {
            id: "cat-accessories",
            name: "Accessories",
            translated: { name: "Accessories" },
          },
          {
            id: "cat-shoes",
            name: "Shoes",
            translated: { name: "Shoes" },
          },
        ],
      },
      "categories-counts": {
        name: "categories-counts",
        apiAlias: "categories-counts_aggregation",
        buckets: [
          { key: "cat-shoes", count: 248 },
          {
            key: "cat-accessories",
            count: 40,
            "categories-parents": {
              buckets: [
                { key: "parent-1", count: 6 },
                { key: "", count: 28 },
              ],
            },
          },
        ],
      },
    };

    const result = getListingFilters(aggregations);

    expect(result).toEqual([
      {
        code: "categories",
        label: "categories",
        id: "categories",
        name: "categories",
        entities: [
          {
            id: "cat-shoes",
            name: "Shoes",
            translated: { name: "Shoes" },
            count: 248,
          },
          {
            id: "cat-accessories",
            name: "Accessories",
            translated: { name: "Accessories" },
            count: 29,
          },
        ],
      },
    ]);
  });

  it("should build the categories filter without counts when the counts aggregation is missing", () => {
    const aggregations = {
      categories: {
        name: "categories",
        entities: [
          { id: "cat-b", name: "B", translated: { name: "B" } },
          { id: "cat-a", name: "A", translated: { name: "A" } },
        ],
      },
    };

    const result = getListingFilters(aggregations);

    expect(result).toHaveLength(1);
    expect(result[0]?.entities).toEqual([
      { id: "cat-a", name: "A", translated: { name: "A" }, count: undefined },
      { id: "cat-b", name: "B", translated: { name: "B" }, count: undefined },
    ]);
  });

  it("should skip a categories-counts aggregation without a categories aggregation", () => {
    const aggregations = {
      "categories-counts": {
        name: "categories-counts",
        buckets: [{ key: "cat-shoes", count: 248 }],
      },
    };

    expect(getListingFilters(aggregations)).toEqual([]);
  });

  it("should pass through a categories aggregation without entities", () => {
    const aggregations = {
      categories: {
        name: "categories",
        buckets: [{ key: "cat-shoes", count: 248 }],
      },
    };

    expect(getListingFilters(aggregations)).toEqual([
      {
        code: "categories",
        label: "categories",
        name: "categories",
        buckets: [{ key: "cat-shoes", count: 248 }],
      },
    ]);
  });

  it("should skip options aggregation", () => {
    const aggregations = {
      options: {
        name: "options",
        apiAlias: "options_aggregation",
        entities: [],
      },
    };

    const result = getListingFilters(aggregations);
    expect(result).toEqual([]);
  });

  it("should transform properties aggregation", () => {
    const aggregations = {
      properties: {
        name: "properties",
        apiAlias: "properties_aggregation",
        entities: [
          {
            name: "Capacity",
            id: "123",
            translated: {
              name: "Capacity",
            },
            options: [
              {
                name: "1 kg",
                id: "456",
                translated: {
                  name: "1 kg",
                },
              },
            ],
          },
          {
            id: "789",
            options: [
              {
                name: "1 kg",
                id: "456",
                translated: {
                  name: "1 kg",
                },
              },
            ],
          },
        ],
      },
    };

    const result = getListingFilters(aggregations);
    expect(result).toEqual([
      {
        code: "properties",
        name: "Capacity",
        label: "Capacity",
        id: "123",
        translated: {
          name: "Capacity",
        },
        options: [
          {
            name: "1 kg",
            id: "456",
            translated: {
              name: "1 kg",
            },
          },
        ],
      },
      {
        code: "properties",
        label: "properties",
        id: "789",
        options: [
          {
            name: "1 kg",
            id: "456",
            translated: {
              name: "1 kg",
            },
          },
        ],
      },
    ]);
  });
});
