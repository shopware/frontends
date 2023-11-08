import { useSalutations } from "./useSalutations";
import { describe, expect, it, vi } from "vitest";
import { defineComponent } from "vue";
import { shallowMount } from "@vue/test-utils";
import Salutations from "./mocks/Salutations";
import * as apiExports from "@shopware-pwa/api-client";

const Component = defineComponent({
  template: "<div/>",
  props: {},
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
    },
  },
});

describe("useSalutations", () => {
  vi.spyOn(apiExports, "getAvailableSalutations").mockImplementation(() => {
    return new Promise((resolve) => {
      resolve({ elements: Salutations });
    });
  });

  const wrapper = shallowMount(Component, getMockProvide());

  it("should init value on init", async () => {
    await wrapper.vm.mountedCallback();
    expect(wrapper.vm.getSalutations).toStrictEqual(Salutations);
  });
});
