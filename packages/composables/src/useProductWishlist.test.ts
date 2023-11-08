import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { ref, defineComponent } from "vue";
import { useProductWishlist } from "./useProductWishlist";

import * as useLocalWishlist from "./useLocalWishlist";
import * as useSyncWishlist from "./useSyncWishlist";

const Component = defineComponent({
  template: "<div/>",
  props: {},
  setup() {
    const { addToWishlist, removeFromWishlist, isInWishlist } =
      useProductWishlist(
        ref({
          id: "test1",
        }) as any,
      );

    return {
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
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

const mockedPromiseResolve = () => {
  return new Promise((resolve) => {
    resolve(true);
  });
};

describe("useProductWishlist", () => {
  const wrapper = shallowMount(Component, getMockProvide());

  vi.spyOn(useLocalWishlist, "useLocalWishlist").mockImplementation((): any => {
    return {
      getWishlistProducts: () => undefined,
      addToWishlist: mockedPromiseResolve,
      removeFromWishlist: mockedPromiseResolve,
    };
  });

  vi.spyOn(useSyncWishlist, "useSyncWishlist").mockImplementation((): any => {
    return {
      getWishlistProductsSync: () => undefined,
      addToWishlistSync: () => undefined,
      removeFromWishlistSync: () => undefined,
    };
  });

  describe("methods not logged in", () => {
    describe("addToWishlist", () => {
      it("wishlist add product", () => {
        expect(wrapper.vm.addToWishlist()).resolves.toEqual(undefined);
      });
    });

    describe("removeFromWishlist", () => {
      it("wishlist remove product", () => {
        expect(wrapper.vm.removeFromWishlist()).resolves.toEqual(undefined);
      });
    });
  });
});
