import { describe, expect, it } from "vitest";
import { getProductRealPrice } from "./getProductRealPrice";

describe("Shopware helpers - getProductRealPrice", () => {
  it("should return undefined if there is no product", () => {
    // @ts-expect-error type should be wrong here
    const price = getProductRealPrice(undefined);
    expect(price).toBeUndefined();
  });
  it("should return right price extracted from a product", () => {
    const price = getProductRealPrice({
      calculatedPrice: {
        unitPrice: 100,
      },
      // @ts-expect-error type should be wrong here
      calculatedPrices: [{}],
    });
    expect(price).toStrictEqual({
      unitPrice: 100,
    });
  });
  it("should return last price extracted from a product if there are more calculatedPrices in an array", () => {
    const price = getProductRealPrice({
      calculatedPrice: {
        unitPrice: 100,
      },
      calculatedPrices: [
        {
          unitPrice: 15,
        },
        {
          unitPrice: 20,
        },
      ],
    });
    expect(price).toStrictEqual({
      unitPrice: 20,
    });
  });
});
