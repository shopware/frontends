import { describe, expect, it, vi, beforeEach } from "vitest";
import { useProductPrice } from "./useProductPrice";
import { ref } from "vue";
import mockedProduct from "../mocks/Product";
import { useSetup } from "../_test";
import productTierPrices from "../mocks/ProductTierPrices";
import type { Schemas } from "#shopware";

describe("useProductPrice", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it("product price are displayed - standard product", () => {
    const { vm } = useSetup(() => useProductPrice(ref(mockedProduct)));

    expect(vm.price).toStrictEqual(mockedProduct.calculatedPrice);
    expect(vm.totalPrice).toBe(14.45);
    expect(vm.unitPrice).toBe(14.45);
    expect(vm.displayFromVariants).toBe(false);
    expect(vm.displayFrom).toBe(false);
    expect(vm.tierPrices).toStrictEqual([]);
    expect(vm.referencePrice).toStrictEqual(
      mockedProduct.calculatedPrice?.referencePrice,
    );
    expect(vm.isListPrice).toBe(false);
    expect(vm.regulationPrice).toBe(80);
  });

  it("product price are displayed - product with tier prices", () => {
    const { vm } = useSetup(() =>
      useProductPrice(
        ref(productTierPrices.product as unknown as Schemas["Product"]),
      ),
    );

    expect(vm.price).toStrictEqual(
      productTierPrices.product.calculatedPrices[2],
    );
    expect(vm.referencePrice).toStrictEqual(
      productTierPrices.product.calculatedPrices[0].referencePrice,
    );
    expect(vm.displayFrom).toBe(true);
    expect(vm.displayFromVariants).toBe(20);
  });

  it("displayFrom should be false if displayParent is true", () => {
    const { vm } = useSetup(() =>
      useProductPrice(
        ref(
          Object.assign(
            { ...productTierPrices.product },
            {
              calculatedPrices: null,
              variantListingConfig: {
                displayParent: true,
              },
            },
          ) as unknown as Schemas["Product"],
        ),
      ),
    );
    expect(vm.displayFrom).toBe(false);
    expect(vm.isListPrice).toBe(false);
  });

  it("isListPrice should be false with more than one calculatedPrices value", () => {
    const { vm } = useSetup(() =>
      useProductPrice(
        ref(
          Object.assign(
            { ...productTierPrices.product },
            {
              listPrice: 80,
              calculatedPrices: [
                {
                  unitPrice: 10,
                },
                {
                  unitPrice: 20,
                },
              ],
            },
          ) as unknown as Schemas["Product"],
        ),
      ),
    );
    expect(vm.displayFrom).toBe(true);
    expect(vm.isListPrice).toBe(false);
  });

  it("isListPrice should be true with one calculatedPrices value", () => {
    const { vm } = useSetup(() =>
      useProductPrice(
        ref({
          calculatedPrices: [
            {
              listPrice: {
                percentage: 10,
              },
            },
          ],
        } as unknown as Schemas["Product"]),
      ),
    );
    expect(vm.displayFrom).toBe(false);
    expect(vm.isListPrice).toBe(true);
  });

  it("displayFrom - second variant", async () => {
    const { vm } = useSetup(() =>
      useProductPrice(
        ref({
          variantListingConfig: {
            displayParent: true,
          },
          parentId: null,
          calculatedCheapestPrice: {
            hasRange: true,
          },
        } as unknown as Schemas["Product"]),
      ),
    );
    expect(vm.displayFrom).toBe(false);
    expect(vm.isListPrice).toBe(false);
  });
});
