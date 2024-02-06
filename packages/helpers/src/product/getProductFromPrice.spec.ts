import { describe, expect, it } from "vitest";
import { getProductFromPrice } from "./getProductFromPrice";

describe("Shopware helpers - getProductFromPrice", () => {
  it("should return undefined if there is no product", () => {
    // @ts-expect-error type should be wrong here
    const price = getProductFromPrice(undefined);
    expect(price).toBeUndefined();
  });
  it("should return right from price extracted from a product", () => {
    const price = getProductFromPrice({
      calculatedPrice: {
        unitPrice: 100,
      },
      // @ts-expect-error type should be wrong here
      calculatedPrices: [{}],
    });
    expect(price).toBe(100);
  });
  it("should return undefined if there are no calculated prices", () => {
    const price = getProductFromPrice({
      calculatedPrices: undefined,
    });
    expect(price).toBe(undefined);
  });
  it("should return undefined if there are calculated prices but no real price itself", () => {
    const price = getProductFromPrice({
      calculatedPrice: undefined,
      // @ts-expect-error type should be wrong here
      calculatedPrices: [{}],
    });
    expect(price).toBe(undefined);
  });
});
