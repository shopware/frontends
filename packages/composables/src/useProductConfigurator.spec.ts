import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { useProductConfigurator } from "./useProductConfigurator";
// import { useProduct } from "./useProduct";
import { ref } from "vue";
import mockedProduct from "./mocks/Product";
import mockedConfigurator from "./mocks/Configurator";

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
      handleChange,
      findVariantForSelectedOptions,
      isLoadingOptions,
      getOptionGroups,
      getSelectedOptions,
    } = useProductConfigurator();
    return {
      handleChange,
      findVariantForSelectedOptions,
      isLoadingOptions,
      getOptionGroups,
      getSelectedOptions,
    };
  },
});

describe("useProductConfigurator", () => {
  const wrapper = shallowMount(Component(), getMockProvide());

  //   vi.spyOn(useProduct, "useProduct").mockImplementation((): any => {
  //     return {
  //       configurator: ref(mockedConfigurator),
  //       product: ref(mockedProduct),
  //     };
  //   });

  vi.mock("./useProduct.ts", () => ({
    useProduct() {
      return {
        configurator: ref(mockedConfigurator),
        product: ref(mockedProduct),
      };
    },
  }));

  it("handleChange callback function was called", () => {
    const mockedFn = vi.fn();

    wrapper.vm.handleChange("test", "test", mockedFn);
    expect(mockedFn).toHaveBeenCalled();
  });
});
