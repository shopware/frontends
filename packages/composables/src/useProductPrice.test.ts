import { describe, expect, it } from "vitest";
import { useProductPrice } from "./useProductPrice";

describe("useProductPrice", () => {
  describe("computed", () => {
    describe("originalPrice", () => {
      describe("negative", () => {
        it("should return undefined if no product is provided", () => {
          const { originalPrice } = useProductPrice({} as any);
          expect(originalPrice.value).toBe(undefined);
        });
        it("should return undefined if product has no calculatedPrice", () => {
          const { originalPrice } = useProductPrice({} as any);
          expect(originalPrice.value).toBe(undefined);
        });
        it("should return undefined if product has no calculatedPrice.tierPrices", () => {
          const { originalPrice } = useProductPrice({
            calculatedPrice: {},
          } as any);
          expect(originalPrice.value).toBe(undefined);
        });
        it("should return undefined if product has no calculatedPrice.tierPrices[0].unitPrice", () => {
          const { originalPrice } = useProductPrice({
            calculatedPrice: {
              tierPrices: [{}],
            },
          } as any);
          expect(originalPrice.value).toBe(undefined);
        });
      });
    });
    describe("price", () => {
      describe("positive", () => {
        it("should return product.calculatedPrice.totalPrice", () => {
          const { price } = useProductPrice({
            calculatedPrice: {
              totalPrice: 10,
            },
          } as any);
          expect(price.value).toBe(10);
        });
      });
      describe("negative", () => {
        it("should return undefined if no product is provided", () => {
          const { price } = useProductPrice({} as any);
          expect(price.value).toBe(undefined);
        });
        it("should return undefined if product has no calculatedPrice", () => {
          const { price } = useProductPrice({} as any);
          expect(price.value).toBe(undefined);
        });
        it("should return undefined if product has no calculatedPrice.totalPrice", () => {
          const { price } = useProductPrice({
            calculatedPrice: {},
          } as any);
          expect(price.value).toBe(undefined);
        });
      });
    });
    describe("showOriginalPrice", () => {
      describe("positive", () => {
        it("should return true if originalPrice is greater than price", () => {
          const { showOriginalPrice } = useProductPrice({
            calculatedPrice: {
              totalPrice: 10,
            },
            calculatedPrices: [
              {
                unitPrice: 50,
              },
            ],
          } as any);
          expect(showOriginalPrice.value).toBe(true);
        });
      });
      describe("negative", () => {
        it("should return false if no product is provided", () => {
          const { showOriginalPrice } = useProductPrice({} as any);
          expect(showOriginalPrice.value).toBe(false);
        });
        it("should return false if product has no calculatedPrice", () => {
          const { showOriginalPrice } = useProductPrice({} as any);
          expect(showOriginalPrice.value).toBe(false);
        });
        it("should return false if product has no calculatedPrice.tierPrices", () => {
          const { showOriginalPrice } = useProductPrice({
            calculatedPrice: {},
          } as any);
          expect(showOriginalPrice.value).toBe(false);
        });
        it("should return false if product has no calculatedPrice.tierPrices[0].unitPrice", () => {
          const { showOriginalPrice } = useProductPrice({
            calculatedPrice: {
              tierPrices: [{}],
            },
          } as any);
          expect(showOriginalPrice.value).toBe(false);
        });
        it("should return false if product has no calculatedPrice.totalPrice", () => {
          const { showOriginalPrice } = useProductPrice({
            calculatedPrice: {},
          } as any);
          expect(showOriginalPrice.value).toBe(false);
        });
      });
    });

    describe("fromPrice", () => {
      describe("positive", () => {
        it("should return product.calculatedPrice.from", () => {
          const { fromPrice } = useProductPrice({
            calculatedPrices: [
              {
                unitPrice: 20,
                totalPrice: 20,
              },
              {
                unitPrice: 10,
                totalPrice: 10,
              },
            ],
          } as any);
          expect(fromPrice.value).toBe(10);
        });
      });
      describe("negative", () => {
        it("should return undefined if no product is provided", () => {
          const { fromPrice } = useProductPrice({} as any);
          expect(fromPrice.value).toBe(undefined);
        });
        it("should return undefined if product has no calculatedPrice", () => {
          const { fromPrice } = useProductPrice({} as any);
          expect(fromPrice.value).toBe(undefined);
        });
        it("should return undefined if product has no calculatedPrice.from", () => {
          const { fromPrice } = useProductPrice({
            calculatedPrice: {},
          } as any);
          expect(fromPrice.value).toBe(undefined);
        });
      });
    });
  });
});
