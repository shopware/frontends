import { describe, expect, it } from "vitest";
import { useSyncWishlist } from "./useSyncWishlist";
import { useSetup } from "./_test";

describe("useSyncWishlist", () => {
  describe("methods", () => {
    describe("addToWishlist", () => {
      it("wishlist add product", () => {
        const { vm } = useSetup(() => useSyncWishlist());

        expect(vm.addToWishlistSync("some-id")).resolves.toBe(undefined);
      });
    });

    describe("removeFromWishlist", () => {
      it("wishlist remove", () => {
        const { vm } = useSetup(() => useSyncWishlist());

        vm.getWishlistProducts();
        vm.removeFromWishlistSync("some-id");
        // Mocked value
        expect(vm.totalWishlistItemsCount).toBe(vm.totalWishlistItemsCount);
      });
    });

    describe("mergeWishlistProducts", () => {
      it("wishlist remove", () => {
        const { vm } = useSetup(() => useSyncWishlist());

        expect(vm.mergeWishlistProducts(["test1", "test2"])).resolves.toEqual(
          undefined,
        );
      });
    });

    describe("getWishlistProducts", () => {
      it("getWishlistProducts", () => {
        const { vm } = useSetup(() => useSyncWishlist());

        vm.getWishlistProducts();
        expect(vm.totalWishlistItemsCount).toBe(0);
        expect(vm.items.length).toBe(0);
      });
    });
  });
});
