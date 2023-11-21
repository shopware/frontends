import { describe, expect, it, vi } from "vitest";
import { useInternationalization } from "./useInternationalization";
import { shallowMount } from "@vue/test-utils";
import { defineComponent } from "vue";

const url = "http://frontend.test";

const Component = defineComponent({
  template: "<div/>",
  setup() {
    const { getStorefrontUrl } = useInternationalization();
    return { getStorefrontUrl };
  },
});

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
      apiClient: { invoke: vi.fn() },
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
    const wrapper = shallowMount(Component, getMockProvide(url));
    expect(wrapper.vm.getStorefrontUrl()).toBe(url);
  });

  it("should return storefrontUrl with empty context api", async () => {
    const wrapper = shallowMount(Component, getMockProvide(undefined));
    expect(wrapper.vm.getStorefrontUrl()).toBe(url);
  });
});
