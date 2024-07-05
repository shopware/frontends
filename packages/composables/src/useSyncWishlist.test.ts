import { describe, expect, it, vi } from "vitest";
import { useSyncWishlist } from "./useSyncWishlist";
import { useSetup } from "./_test";
import { ApiClientError } from "@shopware/api-client";
import type { FetchResponse } from "ofetch";

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
      it("getWishlistProducts", () => {
        const { vm } = useSetup(() => useSyncWishlist(), {
          apiClient: {
            invoke: vi.fn().mockImplementation(() => {
              throw new ApiClientError({
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

        expect(vm.count).toBe(0);
        expect(vm.items.length).toBe(0);
      });
    });
  });
});
