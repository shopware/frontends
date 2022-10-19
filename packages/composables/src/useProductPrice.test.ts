import { Product } from "@shopware-pwa/types";
import { beforeEach, describe, expect, it } from "vitest";
import { Ref, ref } from "vue";
import { useProductPrice } from "./useProductPrice";

describe("useProductPrice", () => {
  describe("computed", () => {
    describe("originalPrice", () => {
      describe("negative", () => {
        it("should return undefined if product has no calculatedPrice", () => {
          const testProduct = ref({});
          const { originalPrice } = useProductPrice(
            testProduct as Ref<Product>
          );
          expect(originalPrice.value).toBe(undefined);
        });
        it("should return undefined if product has no calculatedPrice.tierPrices", () => {
          const testProduct = ref({
            calculatedPrice: {},
          });
          const { originalPrice } = useProductPrice(
            testProduct as Ref<Product>
          );
          expect(originalPrice.value).toBe(undefined);
        });
      });
    });
    describe("price", () => {
      describe("positive", () => {
        it("should return product.calculatedPrice.totalPrice", () => {
          const testProduct = ref({
            calculatedPrice: {
              totalPrice: 10,
            },
          });
          const { price } = useProductPrice(testProduct as Ref<Product>);
          expect(price.value).toBe(10);
        });
      });
      describe("negative", () => {
        it("should return undefined if product has no calculatedPrice", () => {
          const testProduct = ref({});
          const { price } = useProductPrice(testProduct as Ref<Product>);
          expect(price.value).toBe(undefined);
        });
        it("should return undefined if product has no calculatedPrice.totalPrice", () => {
          const testProduct = ref({
            calculatedPrice: {},
          });
          const { price } = useProductPrice(testProduct as Ref<Product>);
          expect(price.value).toBe(undefined);
        });
      });
    });
    describe("showOriginalPrice", () => {
      describe("positive", () => {
        it("should return true if originalPrice is greater than price", () => {
          const testProduct = ref({
            calculatedPrice: {
              totalPrice: 10,
            },
            calculatedPrices: [
              {
                unitPrice: 50,
              },
            ],
          });
          const { showOriginalPrice } = useProductPrice(
            testProduct as Ref<Product>
          );
          expect(showOriginalPrice.value).toBe(true);
        });
      });
      describe("negative", () => {
        it("should return false if no product is provided", () => {
          const testProduct = ref({});
          const { showOriginalPrice } = useProductPrice(
            testProduct as Ref<Product>
          );
          expect(showOriginalPrice.value).toBe(false);
        });
        it("should return false if product has no calculatedPrice", () => {
          const testProduct = ref({});
          const { showOriginalPrice } = useProductPrice(
            testProduct as Ref<Product>
          );
          expect(showOriginalPrice.value).toBe(false);
        });
        it("should return false if product has no calculatedPrice.tierPrices", () => {
          const testProduct = ref({
            calculatedPrice: {},
          });
          const { showOriginalPrice } = useProductPrice(
            testProduct as Ref<Product>
          );
          expect(showOriginalPrice.value).toBe(false);
        });

        it("should return false if product has no calculatedPrice.totalPrice", () => {
          const testProduct = ref({
            calculatedPrice: {},
          });
          const { showOriginalPrice } = useProductPrice(
            testProduct as Ref<Product>
          );
          expect(showOriginalPrice.value).toBe(false);
        });
      });
    });

    describe("fromPrice", () => {
      describe("positive", () => {
        it("should return product.calculatedPrice.from", () => {
          const testProduct = ref({
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
          });
          const { fromPrice } = useProductPrice(testProduct as Ref<Product>);
          expect(fromPrice.value).toBe(10);
        });
      });
      describe("negative", () => {
        it("should return undefined if product has no calculatedPrice", () => {
          const testProduct = ref({});
          const { fromPrice } = useProductPrice(testProduct as Ref<Product>);
          expect(fromPrice.value).toBe(undefined);
        });
        it("should return undefined if product has no calculatedPrice.from", () => {
          const testProduct = ref({
            calculatedPrice: {},
          });
          const { fromPrice } = useProductPrice(testProduct as Ref<Product>);
          expect(fromPrice.value).toBe(undefined);
        });
      });
    });
  });
});
