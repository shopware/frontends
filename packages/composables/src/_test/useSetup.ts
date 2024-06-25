import { shallowMount } from "@vue/test-utils";
import { vi } from "vitest";
import { defineComponent, h } from "vue";
import { defu } from "defu";

type Injections = {
  shopware: unknown;
  apiClient: {
    invoke: ReturnType<typeof vi.fn>;
  };
};

export function useSetup<V>(setup: () => V, customMocks?: Partial<Injections>) {
  const defaultInjections: Injections = {
    shopware: {},
    apiClient: { invoke: customMocks?.apiClient?.invoke ?? vi.fn() },
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
