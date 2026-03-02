import { ApiClientError } from "@shopware/api-client";
import type { FetchResponse } from "ofetch";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSetup } from "../_test";
import { useSyncWishlist } from "./useSyncWishlist";

describe("useSyncWishlist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const consoleErrorSpy = vi.spyOn(console, "error");
  consoleErrorSpy.mockImplementation(() => {});
  describe("methods", () => {
    describe("addToWishlist", () => {
      it("should add product to the wishlist", async () => {
        const { vm, injections } = useSetup(() => useSyncWishlist());
        injections.apiClient.invoke.mockResolvedValue({});

        await vm.addToWishlistSync("some-id");

        expect(injections.apiClient.invoke).toHaveBeenCalledWith(
          "addProductOnWishlist post /customer/wishlist/add/{productId}",
          { pathParams: { productId: "some-id" } },
        );
      });
    });

    describe("removeFromWishlist", () => {
      it("should remove product from the wishlist", async () => {
        const { vm, injections } = useSetup(() => useSyncWishlist());
        injections.apiClient.invoke.mockResolvedValue({});

        await vm.removeFromWishlistSync("some-id");

        expect(injections.apiClient.invoke).toHaveBeenCalledWith(
          "deleteProductOnWishlist delete /customer/wishlist/delete/{productId}",
          { pathParams: { productId: "some-id" } },
        );
      });
    });

    describe("mergeWishlistProducts", () => {
      it("should sync wishlist", async () => {
        const { vm } = useSetup(() => useSyncWishlist());

        await expect(
          vm.mergeWishlistProducts(["test1", "test2"]),
        ).resolves.toEqual(undefined);
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
        expect(vm.products).toStrictEqual([{ id: "test-id" }]);
      });

      it("getWishlistProducts with custom criteria", async () => {
        const { vm, injections } = useSetup(() => useSyncWishlist());
        injections.apiClient.invoke.mockResolvedValue({
          data: {
            products: {
              elements: [],
              total: 0,
            },
          },
        });

        await vm.getWishlistProducts({ limit: 10, page: 2 });

        expect(injections.apiClient.invoke).toHaveBeenCalledWith(
          expect.stringContaining("readCustomerWishlist"),
          expect.objectContaining({
            body: expect.objectContaining({
              limit: 10,
              page: 2,
              "total-count-mode": "exact",
            }),
          }),
        );
      });

      it("getWishlistProducts with null total, page, limit uses defaults", async () => {
        const { vm, injections } = useSetup(() => useSyncWishlist());
        injections.apiClient.invoke.mockResolvedValue({
          data: {
            products: {
              elements: [{ id: "id-1" }],
            },
          },
        });

        await vm.getWishlistProducts();

        expect(vm.count).toBe(0);
        expect(vm.currentPage).toBe(1);
        expect(vm.limit).toBe(15);
      });
    });

    describe("getWishlistProducts - error", () => {
      it("should handle error after fetching product wishlist", async () => {
        const { vm, injections } = useSetup(() => useSyncWishlist());
        // First, set up a successful call to populate state
        injections.apiClient.invoke.mockResolvedValueOnce({
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
        expect(vm.count).toBe(9);
        expect(vm.items.length).toBe(1);

        // Now test error handling - state should be cleared on error
        injections.apiClient.invoke.mockImplementation(() => {
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
        });
        await vm.getWishlistProducts();
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        // State should be cleared when error occurs
        expect(vm.count).toBe(0);
        expect(vm.items.length).toBe(0);
      });
    });
  });
});
