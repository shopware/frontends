import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";

import { getProductPrice } from "./productPrice";

function calculatedPrice(
  unitPrice: number,
  extra: Partial<Schemas["CalculatedPrice"]> = {},
): Schemas["CalculatedPrice"] {
  return {
    apiAlias: "calculated_price",
    unitPrice,
    totalPrice: unitPrice,
    quantity: 1,
    calculatedTaxes: [],
    taxRules: [],
    listPrice: null,
    referencePrice: null,
    regulationPrice: null,
    ...extra,
  };
}

function product(overrides: Record<string, unknown>): Schemas["Product"] {
  return {
    id: "product-1",
    calculatedPrice: calculatedPrice(10),
    calculatedPrices: [],
    ...overrides,
  } as unknown as Schemas["Product"];
}

describe("getProductPrice", () => {
  it("uses the calculated price when there are no tier prices", () => {
    const result = getProductPrice(
      product({
        calculatedPrice: calculatedPrice(10, {
          regulationPrice: { price: 12 },
        }),
      }),
    );

    expect(result.unitPrice).toBe(10);
    expect(result.totalPrice).toBe(10);
    expect(result.displayFrom).toBe(false);
    expect(result.displayFromVariants).toBe(false);
    expect(result.hasListPrice).toBe(false);
    expect(result.regulationPrice).toBe(12);
    expect(result.tierPrices).toEqual([]);
  });

  it("returns an empty result without a product", () => {
    const result = getProductPrice(undefined);

    expect(result.price).toBeUndefined();
    expect(result.unitPrice).toBeUndefined();
    expect(result.displayFrom).toBe(false);
    expect(result.tierPrices).toEqual([]);
  });

  it("picks the cheapest tier price and flags the from label", () => {
    const result = getProductPrice(
      product({
        calculatedPrices: [
          calculatedPrice(10, { quantity: 1 }),
          calculatedPrice(8, { quantity: 5 }),
          calculatedPrice(6, { quantity: 10 }),
        ],
      }),
    );

    expect(result.displayFrom).toBe(true);
    expect(result.unitPrice).toBe(6);
    expect(result.tierPrices.map((tier) => tier.label)).toEqual([
      "to 1",
      "to 5",
      "from 10",
    ]);
  });

  it("detects a list price reduction", () => {
    const result = getProductPrice(
      product({
        calculatedPrice: calculatedPrice(8, {
          listPrice: {
            apiAlias: "cart_list_price",
            price: 10,
            percentage: 20,
            discount: 2,
          },
        }),
      }),
    );

    expect(result.hasListPrice).toBe(true);
    expect(result.price?.listPrice?.price).toBe(10);
  });

  it("exposes the cheapest variant price when the variants span a range", () => {
    const result = getProductPrice(
      product({
        parentId: "parent-1",
        calculatedPrice: calculatedPrice(20),
        calculatedCheapestPrice: { hasRange: true, unitPrice: 15 },
      }),
    );

    expect(result.displayFromVariants).toBe(15);
  });

  it("hides the variant price when it equals the current price", () => {
    const result = getProductPrice(
      product({
        parentId: "parent-1",
        calculatedPrice: calculatedPrice(15),
        calculatedCheapestPrice: { hasRange: true, unitPrice: 15 },
      }),
    );

    expect(result.displayFromVariants).toBe(false);
  });
});
