import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { useProductAssociations } from "./useProductAssociations";
import { computed } from "vue";
import * as apiExports from "@shopware-pwa/api-client";
import mockedProduct from "./mocks/Product";
import mockedCrossSelling from "./mocks/CrossSellingResponse";

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

const getLoadAssociationsParams = (method?: string, searchParams?: any) => {
  return {
    method: method ?? null,
    searchParams: searchParams ?? null,
  };
};

const Component = (mockedProductData) => ({
  template: "<div/>",
  props: {},
  setup() {
    const { isLoading, productAssociations, loadAssociations } =
      useProductAssociations(
        computed(() => mockedProductData),
        {
          associationContext: "cross-selling",
        },
      );
    return { isLoading, productAssociations, loadAssociations };
  },
});

describe("useProductAssociations", () => {
  vi.spyOn(apiExports, "invokePost").mockImplementation(() => {
    return new Promise((resolve) => {
      resolve({ data: mockedCrossSelling });
    });
  });

  const wrapper = shallowMount(Component(mockedProduct), getMockProvide());

  it("productAssociations should be empty", () => {
    expect(wrapper.vm.productAssociations).toStrictEqual([]);
  });

  it("load productAssociations - GET - Error", async () => {
    vi.spyOn(apiExports, "invokeGet").mockImplementation(() => {
      throw new Error();
    });
    wrapper.vm.loadAssociations(getLoadAssociationsParams());
    expect(wrapper.vm.productAssociations).toStrictEqual([]);
  });

  it("load productAssociations - POST", async () => {
    await wrapper.vm.loadAssociations(
      getLoadAssociationsParams("post", {
        associations: {
          media: {},
          cover: {
            associations: {
              media: {},
            },
          },
        },
      }),
    );

    expect(wrapper.vm.productAssociations).toStrictEqual(mockedCrossSelling);
  });

  it("load productAssociations - POST - no search params", async () => {
    await wrapper.vm.loadAssociations(getLoadAssociationsParams("post"));

    expect(wrapper.vm.productAssociations).toStrictEqual(mockedCrossSelling);
  });

  it("load productAssociations - GET", async () => {
    vi.spyOn(apiExports, "invokeGet").mockImplementation(() => {
      return new Promise((resolve) => {
        resolve({ data: mockedCrossSelling });
      });
    });

    await wrapper.vm.loadAssociations(getLoadAssociationsParams("get"));

    expect(wrapper.vm.productAssociations).toStrictEqual(mockedCrossSelling);
  });

  it("no product was provided", async () => {
    expect(() =>
      shallowMount(Component(null), getMockProvide()),
    ).toThrowError();
  });
});
