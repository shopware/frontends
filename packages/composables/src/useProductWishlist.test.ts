import { describe, expect, it, vi } from "vitest";
import { useProductWishlist } from "./useProductWishlist";
import { useSetup } from "./_test";
import { useUser } from "./useUser";
import { ref } from "vue";

vi.mock("./useUser");

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

    it("removeFromWishlist", () => {
      vi.mocked(useUser).mockReturnValue({
        isLoggedIn: ref(false),
        isGuestSession: ref(true),
      } as ReturnType<typeof useUser>);
      const { vm } = useSetup(() => useProductWishlist("test3"));

      expect(vm.removeFromWishlist()).resolves.toEqual(undefined);
      expect(vm.isInWishlist).toEqual(false);
    });
  });

  describe("methods logged in", () => {
    vi.mocked(useUser).mockReturnValue({
      isLoggedIn: ref(true),
      isGuestSession: ref(false),
    } as ReturnType<typeof useUser>);

    describe("addToWishlist - id only", () => {
      it("wishlist add product", () => {
        const { vm } = useSetup(() => useProductWishlist("test3"));

        expect(vm.addToWishlist()).resolves.toEqual(undefined);
      });
    });

    it("removeFromWishlist", () => {
      vi.mocked(useUser).mockReturnValue({
        isLoggedIn: ref(true),
        isGuestSession: ref(false),
      } as ReturnType<typeof useUser>);
      const { vm } = useSetup(() => useProductWishlist("test3"));

      expect(vm.removeFromWishlist()).resolves.toEqual(undefined);
      expect(vm.isInWishlist).toEqual(false);
    });
  });
});
