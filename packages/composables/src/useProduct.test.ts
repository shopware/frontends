import { describe, expect, it } from "vitest";
import { defineComponent } from "vue";
import { shallowMount } from "@vue/test-utils";
import { useProduct } from "./useProduct";
import mockedProduct from "./mocks/Product";
const Component = defineComponent({
  template: "<div/>",
  props: {},
  setup() {
    const { product, configurator, changeVariant } = useProduct(mockedProduct);
    return { product, configurator, changeVariant };
  },
});

describe("useProduct", () => {
  const wrapper = shallowMount(Component);

  it("should return product object", () => {
    expect(wrapper.vm.product).toStrictEqual(mockedProduct);
  });

  it("should return undefined configurator object", () => {
    expect(wrapper.vm.configurator).toBe(undefined);
  });
});
