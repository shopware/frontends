import { getProductPriceDiscount } from "./getProductPriceDiscount";
import { describe, expect, it } from "vitest";

describe("Shopware helpers - getProductPriceDiscount", () => {
  it("should return discount value from calculated rice object", () => {
    const productWithPrice: any = {
      calculatedPrice: {
        listPrice: {
          discount: 20,
        },
      },
    };

    const price = getProductPriceDiscount(productWithPrice);
    expect(price).toEqual(20);
  });
  it("should return default value if product was null", () => {
    const price = getProductPriceDiscount(null as any);
    expect(price).toBeUndefined();
  });
});
