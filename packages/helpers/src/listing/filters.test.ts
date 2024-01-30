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
