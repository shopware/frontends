import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { useBreadcrumbs } from "./useBreadcrumbs";
import { defineComponent } from "vue";

const Component = defineComponent({
  template: "<div/>",
  setup() {
    const { clearBreadcrumbs, breadcrumbs } = useBreadcrumbs([
      {
        name: "Test",
        path: "/",
      },
    ]);

    return {
      clearBreadcrumbs,
      breadcrumbs,
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

describe("useBreadcrumbs", () => {
  const wrapper = shallowMount(Component, getMockProvide());
  it("should add breadcrumbs", async () => {
    expect(wrapper.vm.breadcrumbs.length).toBe(1);
  });

  it("should clear breadcrumbs", async () => {
    wrapper.vm.clearBreadcrumbs();
    expect(wrapper.vm.breadcrumbs.length).toBe(0);
  });
});
