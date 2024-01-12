import { shallowMount } from "@vue/test-utils";
import { vi } from "vitest";
import { defineComponent, h } from "vue";
import { defu } from "defu";

type Injections = {
  shopware: {
    apiInstance: {
      config: Record<string, unknown>;
    };
  };
  apiClient: {
    invoke: ReturnType<typeof vi.fn>;
  };
};

export function useSetup<V>(
  setup: () => V,
  customMocks?: Record<string, unknown>,
) {
  const defaultInjections: Injections = {
    shopware: {
      apiInstance: {
        config: {},
      },
    },
    apiClient: { invoke: vi.fn() },
  };

  const compoment = defineComponent({
    setup,
    render() {
      return h("div", []);
    },
  });

  const injections: Injections = defu(
    defaultInjections,
    customMocks || {},
  ) as Injections;

  const wrapper = shallowMount(compoment, {
    global: {
      provide: injections,
    },
  });

  return {
    injections,
    wrapper,
    vm: wrapper.vm,
  };
}
