import { describe, expect, it } from "vitest";
import { isCategory } from "./index";

describe("isCategory", () => {
  it("should return true when entity is a product", () => {
    const entity = {
      apiAlias: "category",
    };

    const result = isCategory(entity);

    expect(result).toBe(true);
  });

  it("should return false when entity is not a product", () => {
    const entity = {
      apiAlias: "product",
    };

    const result = isCategory(entity);

    expect(result).toBe(false);
  });
});
