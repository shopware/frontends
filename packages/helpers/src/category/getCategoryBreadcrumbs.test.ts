import { describe, expect, it } from "vitest";
import { getCategoryBreadcrumbs } from "./getCategoryBreadcrumbs";

describe("getCategoryBreadcrumbs", () => {
  it("should return an empty array if category is undefined", () => {
    // @ts-expect-error - intentionally passing undefined
    const result = getCategoryBreadcrumbs(undefined);
    expect(result).toEqual([]);
  });

  it("should return an empty array if category breadcrumbs are empty", () => {
    const category = {
      translated: {
        breadcrumb: [],
      },
    };
    const result = getCategoryBreadcrumbs(category);
    expect(result).toEqual([]);
  });

  it("should return all breadcrumbs if startIndex is not provided", () => {
    const category = {
      translated: {
        breadcrumb: ["Home", "Category", "Subcategory"],
      },
    };
    const result = getCategoryBreadcrumbs(category);
    expect(result).toEqual([
      { name: "Home" },
      { name: "Category" },
      { name: "Subcategory" },
    ]);
  });

  it("should return breadcrumbs starting from the specified index", () => {
    const category = {
      translated: {
        breadcrumb: ["Home", "Category", "Subcategory"],
      },
    };
    const options = {
      startIndex: 1,
    };
    const result = getCategoryBreadcrumbs(category, options);
    expect(result).toEqual([{ name: "Category" }, { name: "Subcategory" }]);
  });

  it("should return breadcrumbs from the category property if translated property is not available", () => {
    const category = {
      breadcrumb: ["Home", "Category", "Subcategory"],
    };
    const result = getCategoryBreadcrumbs(category);
    expect(result).toEqual([
      { name: "Home" },
      { name: "Category" },
      { name: "Subcategory" },
    ]);
  });
});
