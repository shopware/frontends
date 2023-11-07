import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { useProductPrice } from "./useProductPrice";
import { ref } from "vue";
import mockedProduct from "./mocks/Product";
import mockerProductTierPrices from "./mocks/ProductTierPrices";
import type { Product } from "@shopware-pwa/types";

const mockerProductTierPricesObj: Product =
  mockerProductTierPrices.product as unknown as Product; // TODO: proper type of mocked product

const getMockProvide = () => ({
  global: {
    provide: {
      shopware: {
        apiInstance: {
          config: {},
        },
      },
    },
  },
});

const Component = (mockedProductData: any) => ({
  template: "<div/>",
  props: {},
  setup() {
    const {
      price,
      totalPrice,
      unitPrice,
      displayFromVariants,
      displayFrom,
      tierPrices,
      referencePrice,
      isListPrice,
    } = useProductPrice(ref(mockedProductData));
    return {
      price,
      totalPrice,
      unitPrice,
      displayFromVariants,
      displayFrom,
      tierPrices,
      referencePrice,
      isListPrice,
    };
  },
});

describe("useProductPrice", () => {
  it("product price are displayed - standard product", () => {
    const wrapper = shallowMount(Component(mockedProduct), getMockProvide());
    expect(wrapper.vm.price).toStrictEqual(mockedProduct.calculatedPrice);
    expect(wrapper.vm.totalPrice).toBe(14.45);
    expect(wrapper.vm.unitPrice).toBe(14.45);
    expect(wrapper.vm.displayFromVariants).toBe(false);
    expect(wrapper.vm.displayFrom).toBe(false);
    expect(wrapper.vm.tierPrices).toStrictEqual([]);
    expect(wrapper.vm.referencePrice).toStrictEqual(
      mockedProduct.calculatedPrice.referencePrice,
    );
    expect(wrapper.vm.isListPrice).toBe(false);
  });

  it("product price are displayed - product with tier prices", () => {
    const wrapper = shallowMount(
      Component(mockerProductTierPricesObj as unknown as Product), // TODO: proper type of mocked product
      getMockProvide(),
    );

    expect(wrapper.vm.price).toStrictEqual(
      mockerProductTierPricesObj.calculatedPrices[2],
    );
    expect(wrapper.vm.referencePrice).toStrictEqual(
      mockerProductTierPricesObj.calculatedPrices[0].referencePrice,
    );
    expect(wrapper.vm.displayFrom).toBe(true);
    expect(wrapper.vm.displayFromVariants).toBe(20);
  });
});
