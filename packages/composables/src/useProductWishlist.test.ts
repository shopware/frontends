import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { useProductWishlist } from "./useProductWishlist";
import { useSetup } from "./_test";
import type { Schemas } from "#shopware";

describe("useProductWishlist", () => {
  describe("methods not logged in", () => {
    describe("addToWishlist", () => {
      it("wishlist add product", () => {
        const { vm } = useSetup(() => useProductWishlist("test1"));

        expect(vm.addToWishlist()).resolves.toEqual(undefined);
      });
    });

    describe("addToWishlist - id only", () => {
      it("wishlist add product", () => {
        const { vm } = useSetup(() => useProductWishlist("test3"));

        expect(vm.addToWishlist()).resolves.toEqual(undefined);
      });
    });
  });

  describe("methods logged in", () => {
    describe("addToWishlist - id only", () => {
      it("wishlist add product", () => {
        const { vm } = useSetup(() => useProductWishlist("test3"));

        expect(vm.addToWishlist()).resolves.toEqual(undefined);
      });
    });
  });
});
