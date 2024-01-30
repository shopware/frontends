import { describe, expect, it } from "vitest";
import { isProduct } from "./index";

describe("isProduct", () => {
  it("should return true when entity is a product", () => {
    const entity = {
      apiAlias: "product",
    };

    const result = isProduct(entity);

    expect(result).toBe(true);
  });

  it("should return false when entity is not a product", () => {
    const entity = {
      apiAlias: "category",
    };

    const result = isProduct(entity);

    expect(result).toBe(false);
  });
});
