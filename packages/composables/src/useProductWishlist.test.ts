import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useProductWishlist } from "./useProductWishlist";
import { useSetup } from "./_test";
import type { Schemas } from "#shopware";

describe("useProductWishlist", () => {
  describe("methods not logged in", () => {
    describe("addToWishlist", () => {
      it("wishlist add product", () => {
        const { vm } = useSetup(() =>
          useProductWishlist(ref({ id: "test1" } as Schemas["Product"])),
        );

        expect(vm.addToWishlist()).resolves.toEqual(undefined);
      });
    });

    describe("removeFromWishlist", () => {
      it("wishlist remove product", () => {
        const { vm } = useSetup(() =>
          useProductWishlist(ref({ id: "test1" } as Schemas["Product"])),
        );

        expect(vm.removeFromWishlist()).resolves.toEqual(undefined);
      });
    });
  });
});
