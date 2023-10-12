import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";

const Component = {
  template: "<div/>",
  props: {},
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
};

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
