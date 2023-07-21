import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { useNavigation } from "./useNavigation";
import * as apiExports from "@shopware-pwa/api-client";
import Menu from "./mocks/Menu";

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

const Component = {
  template: "<div/>",
  props: {},
  setup() {
    const { navigationElements, loadNavigationElements } = useNavigation();
    return { navigationElements, loadNavigationElements };
  },
};

describe("useNavigation", () => {
  const wrapper = shallowMount(Component, getMockProvide());

  vi.spyOn(apiExports, "getStoreNavigation").mockImplementation(() => {
    return new Promise((resolve) => {
      resolve(Menu);
    });
  });

  it("should set the menu", async () => {
    await wrapper.vm.loadNavigationElements({
      depth: 3,
    });
    expect(wrapper.vm.navigationElements.length).toBe(Menu.length);
  });

  it("menu is empty because of the error", async () => {
    vi.spyOn(apiExports, "getStoreNavigation").mockImplementation(() => {
      throw new Error("Test error");
    });
    await wrapper.vm.loadNavigationElements({
      depth: 3,
    });
    expect(wrapper.vm.navigationElements.length).toBe(0);
  });
});
