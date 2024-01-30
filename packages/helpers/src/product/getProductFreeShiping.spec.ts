import { describe, expect, it } from "vitest";
import { getProductFreeShipping } from "./getProductFreeShipping";

describe("Shopware helpers - getProductFreeShipping", () => {
  it("should return false when no product object", () => {
    const shippingFree = getProductFreeShipping();
    expect(shippingFree).toBe(false);
  });

  it("should return false when no freeShipping property in product", () => {
    const args = {};

    // @ts-expect-error type should be wrong here
    const shippingFree = getProductFreeShipping(args);
    expect(shippingFree).toBe(false);
  });

  it("should return true when freeShipping property in product is true", () => {
    const args = {
      shippingFree: true,
    };

    const freeShipping = getProductFreeShipping(args);
    expect(freeShipping).toBe(true);
  });

  it("should return false when freeShipping property in product is false", () => {
    const args = {
      shippingFree: false,
    };

    const shippingFree = getProductFreeShipping(args);
    expect(shippingFree).toBe(false);
  });
});
