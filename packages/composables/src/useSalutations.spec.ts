import { useSalutations } from "./useSalutations";
import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Salutations from "./mocks/Salutations";
import { defineComponent } from "vue";

const Component = defineComponent({
  template: "<div/>",
  setup() {
    const { mountedCallback, fetchSalutations, getSalutations } =
      useSalutations();

    return {
      mountedCallback,
      fetchSalutations,
      getSalutations,
    };
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

describe("useSalutations", () => {
  it("should init value on init", async () => {
    const providedMock = getMockProvide();
    providedMock.global.provide.apiClient.invoke.mockResolvedValue({
      elements: Salutations,
    });
    const wrapper = shallowMount(Component, providedMock);

    await wrapper.vm.mountedCallback();
    expect(providedMock.global.provide.apiClient.invoke).toBeCalledTimes(1);
    expect(wrapper.vm.getSalutations).toStrictEqual(Salutations);
  });
});
