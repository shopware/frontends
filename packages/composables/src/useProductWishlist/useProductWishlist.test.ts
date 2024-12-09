import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { useProductWishlist, useUser } from "#imports";
import { useSetup } from "../_test";

vi.mock("../useUser/useUser.ts");

describe("useProductWishlist", () => {
  describe("methods not logged in", () => {
    describe("addToWishlist", () => {
      it("wishlist add product", async () => {
        const { vm } = useSetup(() => useProductWishlist("test1"));

        await expect(vm.addToWishlist()).resolves.toEqual(undefined);
      });
    });

    describe("addToWishlist - id only", () => {
      it("wishlist add product", async () => {
        const { vm } = useSetup(() => useProductWishlist("test3"));

        await expect(vm.addToWishlist()).resolves.toEqual(undefined);
      });
    });

    it("removeFromWishlist", async () => {
      vi.mocked(useUser).mockReturnValue({
        isLoggedIn: ref(false),
        isGuestSession: ref(true),
      } as ReturnType<typeof useUser>);
      const { vm } = useSetup(() => useProductWishlist("test3"));

      await expect(vm.removeFromWishlist()).resolves.toEqual(undefined);
      expect(vm.isInWishlist).toEqual(false);
    });
  });

  describe("methods logged in", () => {
    vi.mocked(useUser).mockReturnValue({
      isLoggedIn: ref(true),
      isGuestSession: ref(false),
    } as ReturnType<typeof useUser>);

    describe("addToWishlist - id only", () => {
      it("wishlist add product", async () => {
        const { vm } = useSetup(() => useProductWishlist("test3"));

        await expect(vm.addToWishlist()).resolves.toEqual(undefined);
      });
    });

    it("removeFromWishlist", async () => {
      vi.mocked(useUser).mockReturnValue({
        isLoggedIn: ref(true),
        isGuestSession: ref(false),
      } as ReturnType<typeof useUser>);
      const { vm } = useSetup(() => useProductWishlist("test3"));

      await expect(vm.removeFromWishlist()).resolves.toEqual(undefined);
      expect(vm.isInWishlist).toEqual(false);
    });
  });
});
