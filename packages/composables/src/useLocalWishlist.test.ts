import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { useLocalWishlist } from "./useLocalWishlist";
import { defineComponent } from "vue";

const Component = defineComponent({
  template: "<div/>",
  props: {},
  setup() {
    const {
      getWishlistProducts,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      items,
      count,
    } = useLocalWishlist();

    return {
      getWishlistProducts,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      items,
      count,
    };
  },
});

describe("useLocalWishlist", () => {
  const wrapper = shallowMount(Component);

  describe("methods", () => {
    const product: any = {
      id: "some-id",
    };

    describe("addToWishlist", () => {
      it("wishlist add product", () => {
        wrapper.vm.addToWishlist(product.id);
        expect(wrapper.vm.items.length).toBe(1);
      });
    });

    describe("removeFromWishlist", () => {
      it("wishlist add product", () => {
        wrapper.vm.removeFromWishlist(product.id);
        expect(wrapper.vm.items.length).toBe(0);
      });
    });

    describe("removeFromWishlist", () => {
      it("wishlist remove product", () => {
        wrapper.vm.removeFromWishlist(product.id);
        expect(wrapper.vm.count).toBe(0);
      });
    });

    describe("clearWishlist", () => {
      it("clearWishlist", () => {
        wrapper.vm.addToWishlist(product.id);
        expect(wrapper.vm.count).toBe(1);
        wrapper.vm.clearWishlist();
        expect(wrapper.vm.count).toBe(0);
      });
    });

    describe("getWishlistProducts", () => {
      it("getWishlistProducts", () => {
        wrapper.vm.clearWishlist();
        wrapper.vm.getWishlistProducts();
        expect(wrapper.vm.count).toBe(0);
      });
      it("getWishlistProducts with items", () => {
        wrapper.vm.addToWishlist(product.id);
        wrapper.vm.getWishlistProducts();
        expect(wrapper.vm.count).toBe(1);
      });
    });
  });
});
