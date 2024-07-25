import { describe, expect, it } from "vitest";
import { useSetup } from "./_test";
import { useLocalWishlist } from "./useLocalWishlist";

describe("useLocalWishlist", () => {
  describe("methods", () => {
    describe("should add product to the wishlist", () => {
      it("wishlist add product", () => {
        const { vm } = useSetup(useLocalWishlist);
        vm.addToWishlist("some-id");
        expect(vm.items.length).toBe(1);
      });
    });

    describe("removeFromWishlist", () => {
      it("should remove product from the wishlist", () => {
        const { vm } = useSetup(useLocalWishlist);
        vm.removeFromWishlist("some-id");
        expect(vm.items.length).toBe(0);
      });
    });

    describe("clearWishlist", () => {
      it("should clear the wishlist", () => {
        const { vm } = useSetup(useLocalWishlist);
        vm.addToWishlist("some-id");
        expect(vm.count).toBe(1);
        vm.clearWishlist();
        expect(vm.count).toBe(0);
      });
    });

    describe("getWishlistProducts", () => {
      it("should get the wishlist products", () => {
        const { vm } = useSetup(useLocalWishlist);
        vm.clearWishlist();
        vm.getWishlistProducts();
        expect(vm.count).toBe(0);
      });
      it("should get the wishlist products after adding product", () => {
        const { vm } = useSetup(useLocalWishlist);
        vm.addToWishlist("some-id");
        vm.getWishlistProducts();
        expect(vm.count).toBe(1);
      });
      it("getWishlistProducts with items localStorage", () => {
        const { vm } = useSetup(useLocalWishlist);
        localStorage.removeItem("sw-wishlist-items");
        vm.getWishlistProducts();
        expect(vm.count).toBe(1);
      });
    });
  });
});
