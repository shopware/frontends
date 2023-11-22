import { useSalutations } from "./useSalutations";
import { describe, expect, it, vi } from "vitest";
import { defineComponent } from "vue";
import { shallowMount, flushPromises } from "@vue/test-utils";
import Salutations from "./mocks/Salutations";
import * as apiExports from "@shopware-pwa/api-client";

const Component = defineComponent({
  template: "<div/>",
  setup() {
    const { fetchSalutations, getSalutations } = useSalutations();

    return {
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
  vi.spyOn(apiExports, "getAvailableSalutations").mockImplementation(
    (): any => {
      return new Promise((resolve) => {
        resolve({ elements: Salutations });
      });
    },
  );

  const wrapper = shallowMount(Component, getMockProvide());

  it("should init value on init", async () => {
    const providedMock = getMockProvide();
    providedMock.global.provide.apiClient.invoke.mockResolvedValue({
      elements: Salutations,
    });
    const wrapper = shallowMount(Component, providedMock);
    await flushPromises();

    expect(providedMock.global.provide.apiClient.invoke).toBeCalledTimes(1);
    expect(wrapper.vm.getSalutations).toStrictEqual(Salutations);
  });
});
