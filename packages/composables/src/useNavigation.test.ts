import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { useNavigation } from "./useNavigation";
import { defineComponent } from "vue";
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
      apiClient: { invoke: vi.fn() },
    },
  },
});

const Component = defineComponent({
  template: "<div/>",
  setup() {
    const { navigationElements, loadNavigationElements } = useNavigation();
    return { navigationElements, loadNavigationElements };
  },
});

describe("useNavigation", () => {
  const wrapper = shallowMount(Component, getMockProvide());

  vi.spyOn(apiExports, "getStoreNavigation").mockImplementation((): any => {
    return new Promise((resolve) => {
      resolve(Menu);
    });
  });

  it("should set the menu", async () => {
    const mockedProvide = getMockProvide();
    mockedProvide.global.provide.apiClient.invoke.mockResolvedValue(Menu);
    const wrapper = shallowMount(Component, mockedProvide);

    await wrapper.vm.loadNavigationElements({
      depth: 3,
    });
    expect(wrapper.vm.navigationElements).not.toBeNull();
    expect(wrapper.vm.navigationElements!.length).toBe(Menu.length);
  });

  it("menu is empty because of the error", async () => {
    const mockedProvide = getMockProvide();
    mockedProvide.global.provide.apiClient.invoke.mockRejectedValue(null);
    const wrapper = shallowMount(Component, mockedProvide);

    await wrapper.vm.loadNavigationElements({
      depth: 3,
    });
    expect(wrapper.vm.navigationElements?.length).toBe(0);
  });
});
