import { describe, expect, it } from "vitest";

import {
  getCategoryFilterAggregations,
  getCategoryFilterPostFilter,
  resolveCategoryBucketCount,
} from "./categoryFilter";

describe("getCategoryFilterAggregations", () => {
  it("should return the entity and counts aggregations", () => {
    expect(getCategoryFilterAggregations()).toEqual([
      {
        name: "categories",
        type: "entity",
        definition: "category",
        field: "categoriesRo.id",
      },
      {
        name: "categories-counts",
        type: "terms",
        field: "categoriesRo.id",
      },
    ]);
  });

  it("should return a fresh array on each call", () => {
    const first = getCategoryFilterAggregations();
    const second = getCategoryFilterAggregations();
    expect(first).not.toBe(second);
    expect(first[0]).not.toBe(second[0]);
  });
});

describe("getCategoryFilterPostFilter", () => {
  it("should build an equalsAny post filter with pipe-separated ids", () => {
    expect(getCategoryFilterPostFilter(["id-1", "id-2"])).toEqual({
      field: "categoriesRo.id",
      type: "equalsAny",
      value: "id-1|id-2",
    });
  });

  it("should handle a single id", () => {
    expect(getCategoryFilterPostFilter(["id-1"]).value).toBe("id-1");
  });
});

describe("resolveCategoryBucketCount", () => {
  it("should return the bucket count when no nested aggregation is present", () => {
    expect(resolveCategoryBucketCount({ key: "id-1", count: 7 })).toBe(7);
  });

  it("should count each parent product once and standalone products individually", () => {
    const bucket = {
      key: "id-1",
      count: 12,
      "categories-parents": {
        buckets: [
          // 5 variants of one parent product -> counts as 1
          { key: "parent-1", count: 5 },
          // 4 variants of another parent product -> counts as 1
          { key: "parent-2", count: 4 },
          // 3 standalone products (no parent) -> count as 3
          { key: "", count: 3 },
        ],
      },
    };
    expect(resolveCategoryBucketCount(bucket)).toBe(5);
  });

  it("should treat a null parent key as standalone products", () => {
    const bucket = {
      key: "id-1",
      count: 2,
      "categories-parents": {
        buckets: [{ key: null, count: 2 }],
      },
    };
    expect(resolveCategoryBucketCount(bucket)).toBe(2);
  });
});
