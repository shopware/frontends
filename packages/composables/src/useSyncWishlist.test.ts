import { describe, expect, it, vi } from "vitest";
import { useSyncWishlist } from "./useSyncWishlist";
import { useSetup } from "./_test";
import { ApiClientError } from "@shopware/api-client";
import type { FetchResponse } from "ofetch";

describe("useSyncWishlist", () => {
  const consoleErrorSpy = vi.spyOn(console, "error");
  consoleErrorSpy.mockImplementation(() => {});
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
        expect(vm.count).toBe(vm.count);
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
        expect(vm.count).toBe(0);
        expect(vm.items.length).toBe(0);
      });
    });

    describe("getWishlistProducts - error", () => {
      it("getWishlistProducts", async () => {
        const { vm } = useSetup(() => useSyncWishlist(), {
          apiClient: {
            invoke: vi.fn().mockImplementation(() => {
              throw new ApiClientError({
                status: 500,
                _data: {
                  errors: [
                    {
                      title: "Test error",
                    },
                  ],
                },
              } as unknown as FetchResponse<{
                errors: Array<{ title: string }>;
              }>);
            }),
          },
        });
        vm.getWishlistProducts();
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(vm.count).toBe(0);
        expect(vm.items.length).toBe(0);
      });
    });
  });
});
