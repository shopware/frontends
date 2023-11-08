import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { useProductConfigurator } from "./useProductConfigurator";
import { ref, defineComponent } from "vue";
import mockedProduct from "./mocks/Product";
import mockedConfigurator from "./mocks/Configurator";
import * as apiExports from "@shopware-pwa/api-client";

const getMockProvide = () => ({
  global: {
    provide: {
      shopware: {
        apiInstance: {
          defaults: {
            headers: {
              common: [],
            },
          },
          config: {},
        },
      },
    },
  },
});

const Component = () =>
  defineComponent({
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

  vi.spyOn(apiExports, "invokePost").mockImplementation(() => {
    return new Promise((resolve) => {
      resolve({ data: { elements: [mockedProduct] } });
    });
  });

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

  it("findVariantForSelectedOptions", async () => {
    expect(
      await wrapper.vm.findVariantForSelectedOptions({
        test: "test",
      }),
    ).toStrictEqual(mockedProduct);

    expect(await wrapper.vm.findVariantForSelectedOptions()).toStrictEqual(
      mockedProduct,
    );
  });

  it("findVariantForSelectedOptions - error", async () => {
    const spyPost = vi
      .spyOn(apiExports, "invokePost")
      .mockImplementation(() => {
        throw new Error();
      });

    await wrapper.vm.findVariantForSelectedOptions({
      test: "test",
    });
    expect(spyPost).toThrowError();
  });
});
