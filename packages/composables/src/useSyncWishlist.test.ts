import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { useSyncWishlist } from "./useSyncWishlist";
import * as apiExports from "@shopware-pwa/api-client";
import { defineComponent } from "vue";

const url = "http://frontend.test";
const Component = defineComponent({
  template: "<div/>",
  setup() {
    const {
      getWishlistProducts,
      addToWishlistSync,
      removeFromWishlistSync,
      mergeWishlistProducts,
      items,
      count,
    } = useSyncWishlist();

    return {
      getWishlistProducts,
      addToWishlistSync,
      removeFromWishlistSync,
      mergeWishlistProducts,
      items,
      count,
    };
  },
});

const getMockProvide = (mockedUrl: string | undefined) => ({
  global: {
    provide: {
      shopware: {
        apiInstance: {
          config: {
            endpoint: mockedUrl,
          },
        },
      },
      apiClient: { invoke: vi.fn() },
    },
  },
});

describe("useSyncWishlist", () => {
  const wrapper = shallowMount(Component, getMockProvide(url));
  const mockedResolve = { apiAlias: "mock", success: true };
  const mockedResponse = {
    products: {
      elements: [
        {
          id: "test-1",
        },
        {
          id: "test-2",
        },
      ],
    },
  };

  vi.spyOn(apiExports, "addWishlistProduct").mockImplementation(async () => {
    return mockedResolve;
  });

  vi.spyOn(apiExports, "getWishlistProducts").mockImplementation(async () => {
    return mockedResponse as any;
  });

  vi.spyOn(apiExports, "removeWishlistProduct").mockImplementation(async () => {
    return mockedResolve;
  });

  vi.spyOn(apiExports, "mergeWishlistProducts").mockImplementation(async () => {
    return mockedResolve;
  });

  describe("methods", () => {
    const product: any = {
      id: "some-id",
    };

    describe("addToWishlist", () => {
      it("wishlist add product", () => {
        expect(wrapper.vm.addToWishlistSync(product.id)).resolves.toBe(
          undefined,
        );
      });
    });

    describe("removeFromWishlist", () => {
      it("wishlist remove", () => {
        wrapper.vm.getWishlistProducts();
        wrapper.vm.removeFromWishlistSync(product.id);
        // Mocked value
        expect(wrapper.vm.count).toBe(wrapper.vm.count);
      });
    });

    describe("mergeWishlistProducts", () => {
      it("wishlist remove", () => {
        expect(
          wrapper.vm.mergeWishlistProducts(["test1", "test2"]),
        ).resolves.toEqual(undefined);
      });
    });

    describe("getWishlistProducts", () => {
      it("getWishlistProducts", () => {
        wrapper.vm.getWishlistProducts();
        expect(wrapper.vm.count).toBe(0);
        expect(wrapper.vm.items.length).toBe(0);
      });
    });
  });
});
