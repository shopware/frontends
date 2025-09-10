import { describe, expect, it } from "vitest";
import { isProductOnSale } from "./isProductOnSale";

interface ProductWithCalculatedPrice {
  calculatedPrice?: {
    listPrice?: {
      percentage?: number;
    };
  };
}

describe("isProductOnSale", () => {
  it("should return true when product has a positive discount percentage", () => {
    const product: ProductWithCalculatedPrice = {
      calculatedPrice: {
        listPrice: {
          percentage: 20,
        },
      },
    };

    expect(isProductOnSale(product)).toBe(true);
  });

  it("should return false when product has zero discount percentage", () => {
    const product: ProductWithCalculatedPrice = {
      calculatedPrice: {
        listPrice: {
          percentage: 0,
        },
      },
    };

    expect(isProductOnSale(product)).toBe(false);
  });

  it("should return false when product has negative discount percentage", () => {
    const product: ProductWithCalculatedPrice = {
      calculatedPrice: {
        listPrice: {
          percentage: -5,
        },
      },
    };

    expect(isProductOnSale(product)).toBe(false);
  });

  it("should return false when percentage is undefined", () => {
    const product: ProductWithCalculatedPrice = {
      calculatedPrice: {
        listPrice: {},
      },
    };

    expect(isProductOnSale(product)).toBe(false);
  });

  it("should return false when listPrice is undefined", () => {
    const product: ProductWithCalculatedPrice = {
      calculatedPrice: {},
    };

    expect(isProductOnSale(product)).toBe(false);
  });

  it("should return false when calculatedPrice is undefined", () => {
    // product must be an object (not null/undefined) per new contract
    const product: ProductWithCalculatedPrice = {};

    expect(isProductOnSale(product)).toBe(false);
  });

  it("should handle decimal percentage values", () => {
    const product: ProductWithCalculatedPrice = {
      calculatedPrice: {
        listPrice: {
          percentage: 0.5,
        },
      },
    };

    expect(isProductOnSale(product)).toBe(true);
  });

  it("should handle very small positive percentage values", () => {
    const product: ProductWithCalculatedPrice = {
      calculatedPrice: {
        listPrice: {
          percentage: 0.0001,
        },
      },
    };

    expect(isProductOnSale(product)).toBe(true);
  });
});
