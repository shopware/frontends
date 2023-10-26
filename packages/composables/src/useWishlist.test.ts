import { describe, expect, it, vi } from "vitest";
import { useWishlist } from "./useWishlist";
import * as useUser from "./useUser";
import { shallowMount } from "@vue/test-utils";
import { computed } from "vue";

const Component = {
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

describe("useWishlist", () => {
  const wrapper = shallowMount(Component, getMockProvide());

  vi.spyOn(useUser, "useUser").mockImplementation((): any => {
    return {
      isLoggedIn: computed(() => true),
      isGuestSession: computed(() => false),
    };
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
        mergeWishlistProducts: (items) => undefined,
        removeFromWishlistSync: () => undefined,
      };
    },
  }));

  it("mergeWishlistProducts", async () => {
    expect(wrapper.vm.items.length).toBe(1);
    expect(wrapper.vm.count).toBe(1);
    await wrapper.vm.clearWishlist();
    await wrapper.vm.getWishlistProducts();
    await wrapper.vm.mergeWishlistProducts();
  });
});
