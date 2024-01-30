import { describe, expect, it } from "vitest";
import { getProductTierPrices } from "./getProductTierPrices";

describe("Shopware helpers - getProductTierPrices", () => {
  it("should return default value if product was null", () => {
    const argument = { product: null };
    // @ts-expect-error type should be wrong here
    const price = getProductTierPrices(argument);
    expect(price).toStrictEqual([]);
  });
  it("should return default value if no argument was provided", () => {
    const price = getProductTierPrices(undefined);
    expect(price).toStrictEqual([]);
  });
  it("should return parsed array of TierPrice interface instance", () => {
    const product = {
      calculatedPrices: [
        {
          unitPrice: 50,
          quantity: 5,
        },
        {
          unitPrice: 19.95,
          quantity: 10,
        },
      ],
    };
    const price = getProductTierPrices(product);
    expect(price).toStrictEqual([
      {
        label: "to 5",
        quantity: 5,
        unitPrice: 50,
      },
      {
        label: "from 10",
        quantity: 10,
        unitPrice: 19.95,
      },
    ]);
  });
});
