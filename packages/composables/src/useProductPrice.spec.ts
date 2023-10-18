import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { useProductPrice } from "./useProductPrice";
import { ref } from "vue";
import mockedProduct from "./mocks/Product";

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

const Component = () => ({
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
    } = useProductPrice(ref(mockedProduct));
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
  const wrapper = shallowMount(Component(), getMockProvide());

  it("product price", () => {
    expect(wrapper.vm.price).toStrictEqual(mockedProduct.calculatedPrice);
    expect(wrapper.vm.totalPrice).toBe(14.45);
    expect(wrapper.vm.unitPrice).toBe(14.45);
    expect(wrapper.vm.displayFromVariants).toBe(undefined);
    expect(wrapper.vm.displayFrom).toBe(false);
    expect(wrapper.vm.tierPrices).toStrictEqual([]);
    expect(wrapper.vm.referencePrice).toStrictEqual(
      mockedProduct.calculatedPrice.referencePrice,
    );
  });
});
