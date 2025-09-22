import { describe, expect, it } from "vitest";
import { isProductTopSeller } from "./isProductTopSeller";

describe("isProductTopSeller", () => {
  it("should return true when product is marked as top seller", () => {
    const product = { markAsTopseller: true };
    expect(isProductTopSeller(product)).toBe(true);
  });

  it("should return false when product is explicitly not marked as top seller", () => {
    const product = { markAsTopseller: false };
    expect(isProductTopSeller(product)).toBe(false);
  });

  it("should return false when markAsTopseller property is undefined", () => {
    const product = { someOtherProperty: "value" };
    // @ts-expect-error Testing with incompatible product structure
    expect(isProductTopSeller(product)).toBe(false);
  });

  it("should handle null values correctly", () => {
    const product = { markAsTopseller: null };
    // @ts-expect-error Testing with null value even though type doesn't allow it
    expect(isProductTopSeller(product)).toBe(false);
  });

  it("should coerce truthy non-boolean values to true", () => {
    const product = { markAsTopseller: 1 };
    // @ts-expect-error Testing with non-boolean value
    expect(isProductTopSeller(product)).toBe(true);
  });

  it("should coerce falsy non-boolean values to false", () => {
    const product = { markAsTopseller: 0 };
    // @ts-expect-error Testing with non-boolean value
    expect(isProductTopSeller(product)).toBe(false);
  });
});
