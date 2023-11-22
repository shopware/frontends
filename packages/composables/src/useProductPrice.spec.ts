import { describe, expect, it } from "vitest";
import { useProductPrice } from "./useProductPrice";
import { ref } from "vue";
import mockedProduct from "./mocks/Product";
import { useSetup } from "./_test";
import productTierPrices from "./mocks/ProductTierPrices";
import { Schemas } from "#shopware";

describe("useProductPrice", () => {
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
});
