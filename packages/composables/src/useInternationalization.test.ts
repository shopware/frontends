import { describe, expect, it } from "vitest";
import { useInternationalization } from "./useInternationalization";
import { shallowMount } from "@vue/test-utils";

const url = "http://frontend.test";

const Component = {
  template: "<div/>",
  props: {},
  setup() {
    const { getStorefrontUrl } = useInternationalization();
    return { getStorefrontUrl };
  },
};

const getMockProvide = (mockedUrl: string | undefined) => ({
  global: {
    provide: {
      shopware: {
        apiInstance: {
          config: {
            endpoint: mockedUrl,
          },
        },
      },
    },
  },
});

describe("useInternationalization", () => {
  global.window = Object.create(window);

  Object.defineProperty(window, "location", {
    value: {
      origin: url,
    },
  });

  it("should return storefrontUrl", async () => {
    const wrapper = shallowMount(Component, getMockProvide(url + "/"));
    expect(wrapper.vm.getStorefrontUrl()).toBe(url);
  });

  it("should return storefrontUrl with empty context api", async () => {
    const wrapper = shallowMount(Component, getMockProvide(undefined));
    expect(wrapper.vm.getStorefrontUrl()).toBe(url);
  });
});
