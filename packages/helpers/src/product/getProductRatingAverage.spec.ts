import { describe, expect, it } from "vitest";
import { getProductRatingAverage } from "./getProductRatingAverage";
describe("Shopware helpers - getProductRatingAverage", () => {
  it("should return undefined when no product object", () => {
    // @ts-expect-error type should be wrong here
    const productNumber = getProductRatingAverage(undefined);
    expect(productNumber).toBe(undefined);
  });

  it("should return undfined when no getProductRatingAverage property in product", () => {
    const args = {};
    // @ts-expect-error type should be wrong here
    const productNumber = getProductRatingAverage(args);
    expect(productNumber).toBe(undefined);
  });

  it("should return Number when getProductRatingAverage property is in product", () => {
    const args = {
      ratingAverage: 5,
    };

    const freeShipping = getProductRatingAverage(args);
    expect(freeShipping).toBe(5);
  });
});
