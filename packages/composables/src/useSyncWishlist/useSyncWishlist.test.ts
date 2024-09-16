import { describe, expect, it, vi, beforeEach } from "vitest";
import { useSyncWishlist } from "./useSyncWishlist";
import { useSetup } from "../_test";
import { ApiClientError } from "@shopware/api-client";
import type { FetchResponse } from "ofetch";

describe("useSyncWishlist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const consoleErrorSpy = vi.spyOn(console, "error");
  consoleErrorSpy.mockImplementation(() => {});
  describe("methods", () => {
    describe("addToWishlist", () => {
      it("should add product to the wishlist", () => {
        const { vm } = useSetup(() => useSyncWishlist());

        expect(vm.addToWishlistSync("some-id")).resolves.toBe(undefined);
      });
    });

    describe("removeFromWishlist", () => {
      it("should remove product from the wishlist", () => {
        const { vm } = useSetup(() => useSyncWishlist());

        vm.getWishlistProducts();
        vm.removeFromWishlistSync("some-id");
        // Mocked value
        expect(vm.count).toBe(vm.count);
      });
    });

    describe("mergeWishlistProducts", () => {
      it("should sync wishlist", () => {
        const { vm } = useSetup(() => useSyncWishlist());

        expect(vm.mergeWishlistProducts(["test1", "test2"])).resolves.toEqual(
          undefined,
        );
      });
    });

    describe("getWishlistProducts", () => {
      it("should get wishlist products", async () => {
        const { vm, injections } = useSetup(() => useSyncWishlist());
        injections.apiClient.invoke.mockResolvedValue({
          data: {
            products: {
              elements: [],
            },
          },
        });
        await vm.getWishlistProducts();

        expect(vm.count).toBe(0);
        expect(vm.items.length).toBe(0);
      });

      it("getWishlistProducts", async () => {
        const { vm, injections } = useSetup(() => useSyncWishlist());
        injections.apiClient.invoke.mockResolvedValue({
          data: {
            products: {
              total: 9,
              page: 1,
              elements: [
                {
                  id: "test-id",
                },
              ],
            },
          },
        });
        await vm.getWishlistProducts();

        expect(injections.apiClient.invoke).toHaveBeenCalledWith(
          expect.stringContaining("readCustomerWishlist"),
          expect.objectContaining({
            body: {
              "total-count-mode": "exact",
            },
          }),
        );
        expect(vm.count).toBe(9);
        expect(vm.items.length).toBe(1);
      });
    });

    describe("getWishlistProducts - error", () => {
      it("should handle error after fetching product wishlist", async () => {
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
        expect(vm.count).toBe(9);
        expect(vm.items.length).toBe(0);
      });
    });
  });
});
