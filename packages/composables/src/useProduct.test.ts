import { describe, expect, it, vi } from "vitest";
import { defineComponent } from "vue";
import { shallowMount } from "@vue/test-utils";
import { useProduct } from "./useProduct";
import mockedProduct from "./mocks/Product";

const Component = defineComponent({
  template: "<div/>",
  setup() {
    const { product, configurator, changeVariant } = useProduct(mockedProduct);
    return { product, configurator, changeVariant };
  },
});

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

describe("useProduct", () => {
  const wrapper = shallowMount(Component, getMockProvide());

  it("should return product object", () => {
    expect(wrapper.vm.product).toStrictEqual(mockedProduct);
  });

  it("should return undefined configurator object", () => {
    expect(wrapper.vm.configurator).toBe(undefined);
  });
});
