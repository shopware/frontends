import { describe, expect, it, vi } from "vitest";
import { useSetup } from "../_test";
import { useLocalWishlist } from "./useLocalWishlist";

describe("useLocalWishlist", () => {
  describe("methods", () => {
    describe("should add product to the wishlist", () => {
      it("wishlist add product", () => {
        const { vm } = useSetup(useLocalWishlist);
        vm.addToWishlist("some-id");
        expect(vm.items.length).toBe(1);
      });

      it("addToWishlist does not add duplicate", () => {
        const { vm } = useSetup(useLocalWishlist);
        vm.addToWishlist("some-id");
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

      it("should remove existing product from the wishlist", () => {
        const { vm } = useSetup(useLocalWishlist);
        vm.addToWishlist("id-to-remove");
        vm.addToWishlist("id-to-keep");
        vm.removeFromWishlist("id-to-remove");
        expect(vm.items).toEqual(["id-to-keep"]);
      });
    });

    describe("clearWishlist", () => {
      it("should clear the wishlist", async () => {
        const { vm } = useSetup(useLocalWishlist);
        await vm.clearWishlist();
        await vm.addToWishlist("clear-test-id");
        expect(vm.count).toBe(1);
        await vm.clearWishlist();
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
        vm.clearWishlist();
        localStorage.setItem("sw-wishlist-items", JSON.stringify(["id-1"]));
        vm.getWishlistProducts();
        expect(vm.count).toBe(1);
        expect(vm.items).toContain("id-1");
      });
    });

    it("getWishlistProducts with missing localStorage key", () => {
      const { vm } = useSetup(useLocalWishlist);
      vm.clearWishlist();
      localStorage.removeItem("sw-wishlist-items");
      vm.getWishlistProducts();
      expect(vm.count).toBe(0);
    });

    it("getWishlistProducts returns nothing when localStorage is unavailable", () => {
      const { vm } = useSetup(useLocalWishlist);
      vm.clearWishlist();
      const getItemSpy = vi
        .spyOn(localStorage, "getItem")
        .mockImplementation(() => {
          throw new Error("localStorage not available");
        });
      vm.getWishlistProducts();
      getItemSpy.mockRestore();
      expect(vm.count).toBe(0);
    });
  });
});
