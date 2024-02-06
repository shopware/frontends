import { describe, expect, it } from "vitest";
import { getProductCalculatedListingPrice } from "./getProductCalculatedListingPrice";

describe("Shopware helpers - getProductCalculatedListingPrice", () => {
  it("should return listPrice from product", () => {
    const price = getProductCalculatedListingPrice({
      calculatedPrice: {
        listPrice: {
          price: 200,
        },
      },
    });
    expect(price).toEqual(200);
  });
  it("should return unitPrice if there is no listPrice", () => {
    const price = getProductCalculatedListingPrice({
      calculatedPrice: {
        listPrice: {
          // @ts-expect-error type should be wrong here
          price: undefined,
        },
        unitPrice: 300,
      },
    });
    expect(price).toEqual(300);
  });
  it("should return undefined if there is no product", () => {
    const price = getProductCalculatedListingPrice(undefined);
    expect(price).toBeUndefined();
  });

  it("should return undefined if there is no calculatedPrices", () => {
    const price = getProductCalculatedListingPrice({});
    expect(price).toBeUndefined();
  });

  it("should return undefined if calculatedPrices is an empty array", () => {
    const price = getProductCalculatedListingPrice({
      calculatedPrices: [],
    });
    expect(price).toBeUndefined();
  });
});
