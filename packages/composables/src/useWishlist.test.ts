import { describe, expect, it, vi } from "vitest";
import { useWishlist } from "./useWishlist";
import { shallowMount } from "@vue/test-utils";
import * as useUser from "./useUser";
import { defineComponent } from "vue";

const Component = defineComponent({
  template: "<div/>",
  props: {},
  setup() {
    const {
      mergeWishlistProducts,
      getWishlistProducts,
      clearWishlist,
      items,
      count,
    } = useWishlist();
    return {
      mergeWishlistProducts,
      getWishlistProducts,
      clearWishlist,
      items,
      count,
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

vi.mock("./useLocalWishlist.ts", () => ({
  useLocalWishlist() {
    return {
      getWishlistProducts: () => undefined,
      items: { value: ["local-testId333"] },
      clearWishlist: () => undefined,
    };
  },
}));

vi.mock("./useSyncWishlist.ts", () => ({
  useSyncWishlist() {
    return {
      getWishlistProducts: () => undefined,
      items: { value: ["sync-testId333"] },
      mergeWishlistProducts: (items: any) => undefined,
      removeFromWishlistSync: () => undefined,
    };
  },
}));

describe("useWishlist - not logged in user", () => {
  vi.spyOn(useUser, "useUser").mockImplementation((): any => {
    return {
      isLoggedIn: { value: false },
      isGuestSession: { value: false },
    };
  });

  const wrapper = shallowMount(Component, getMockProvide());

  it("mergeWishlistProducts", async () => {
    expect(wrapper.vm.items.length).toBe(1);
    expect(wrapper.vm.count).toBe(1);
    await wrapper.vm.clearWishlist();
    await wrapper.vm.getWishlistProducts();
    await wrapper.vm.mergeWishlistProducts();
  });
});

describe("useWishlist - logged in user", () => {
  vi.spyOn(useUser, "useUser").mockImplementation((): any => {
    return {
      isLoggedIn: { value: true },
      isGuestSession: { value: false },
    };
  });

  const wrapper = shallowMount(Component, getMockProvide());

  it("mergeWishlistProducts", async () => {
    expect(wrapper.vm.items.length).toBe(1);
    expect(wrapper.vm.count).toBe(1);
    await wrapper.vm.clearWishlist();
    await wrapper.vm.getWishlistProducts();
    await wrapper.vm.mergeWishlistProducts();
  });
});
