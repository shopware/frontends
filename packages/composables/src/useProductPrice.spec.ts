import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { useProductPrice } from "./useProductPrice";
import { ref, defineComponent } from "vue";
import mockedProduct from "./mocks/Product";
import mockerProductTierPrices from "./mocks/ProductTierPrices";
import type { CalculatedPrice, Product } from "@shopware-pwa/types";

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
      apiClient: { invoke: vi.fn() },
    },
  },
});

const Component = (mockedProductData: any) =>
  defineComponent({
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
      (mockedProduct.calculatedPrice as unknown as CalculatedPrice)
        .referencePrice, // TODO: [OpenAPI][Product] - `calculatedPrice` should be properly defined as `CalculatedPrice` schema
    );
    expect(wrapper.vm.isListPrice).toBe(false);
  });

  it("product price are displayed - product with tier prices", () => {
    const wrapper = shallowMount(
      Component(mockerProductTierPricesObj as unknown as Product), // TODO: proper type of mocked product
      getMockProvide(),
    );

    expect(wrapper.vm.price).toStrictEqual(
      (
        mockerProductTierPricesObj.calculatedPrices as unknown as CalculatedPrice[]
      )[2], // TODO: [OpenAPI][Product] - `calculatedPrices` should be properly defined as `CalculatedPrice[]` schema
    );
    expect(wrapper.vm.referencePrice).toStrictEqual(
      (
        mockerProductTierPricesObj.calculatedPrices as unknown as CalculatedPrice[]
      )[0].referencePrice, // TODO: [OpenAPI][Product] - `calculatedPrices` should be properly defined as `CalculatedPrice[]` schema
    );
    expect(wrapper.vm.displayFrom).toBe(true);
    expect(wrapper.vm.displayFromVariants).toBe(20);
  });
});
