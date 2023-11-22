import { describe, expect, it } from "vitest";
import { useSetup } from "./_test";
import { useLocalWishlist } from "./useLocalWishlist";

describe("useLocalWishlist", () => {
  describe("methods", () => {
    describe("addToWishlist", () => {
      it("wishlist add product", () => {
        const { vm } = useSetup(useLocalWishlist);
        vm.addToWishlist("some-id");
        expect(vm.items.length).toBe(1);
      });
    });

    describe("removeFromWishlist", () => {
      it("wishlist add product", () => {
        const { vm } = useSetup(useLocalWishlist);
        vm.removeFromWishlist("some-id");
        expect(vm.items.length).toBe(0);
      });
    });

    describe("removeFromWishlist", () => {
      it("wishlist remove product", () => {
        const { vm } = useSetup(useLocalWishlist);
        vm.removeFromWishlist("some-id");
        expect(vm.count).toBe(0);
      });
    });

    describe("clearWishlist", () => {
      it("clearWishlist", () => {
        const { vm } = useSetup(useLocalWishlist);
        vm.addToWishlist("some-id");
        expect(vm.count).toBe(1);
        vm.clearWishlist();
        expect(vm.count).toBe(0);
      });
    });

    describe("getWishlistProducts", () => {
      it("getWishlistProducts", () => {
        const { vm } = useSetup(useLocalWishlist);
        vm.clearWishlist();
        vm.getWishlistProducts();
        expect(vm.count).toBe(0);
      });
      it("getWishlistProducts with items", () => {
        const { vm } = useSetup(useLocalWishlist);
        vm.addToWishlist("some-id");
        vm.getWishlistProducts();
        expect(vm.count).toBe(1);
      });
    });
  });
});
