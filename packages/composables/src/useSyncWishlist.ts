import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";
import { useShopwareContext } from "#imports";
import type { ClientApiError } from "@shopware-pwa/types";
import type { Schemas } from "#shopware";

export type UseSyncWishlistReturn = {
  /**
   * Get products from wishlist
   */
  getWishlistProducts(): void;
  /**
   * Merge products with wishlist already existing in API wishlist
   */
  mergeWishlistProducts(itemsToMerge: string[]): void;
  /**
   * Add product to wishlist
   */
  addToWishlistSync(id: string): void;
  /**
   * Remove product from wishlist
   */
  removeFromWishlistSync(id: string): void;
  /**
   * Wishlist items (Product IDs)
   */
  items: ComputedRef<string[]>;
  /**
   * Wishlist items count
   */
  count: ComputedRef<number>;
};

const _wishlistItems: Ref<string[]> = ref([]);

/**
 * Composable to manage wishlist via API
 * @public
 * @category Wishlist
 */
export function useSyncWishlist(): UseSyncWishlistReturn {
  const { apiClient } = useShopwareContext();

  async function addToWishlistSync(id: string) {
    await apiClient.invoke(
      "addProductOnWishlist post /customer/wishlist/add/{productId}",
      {
        productId: id,
      },
    );
  }

  async function removeFromWishlistSync(id: string) {
    await apiClient.invoke(
      "deleteProductOnWishlist delete /customer/wishlist/delete/{productId}",
      {
        productId: id,
      },
    );
  }

  /**
   * Fetch wishlist items
   * Only for logged-in users
   */
  async function getWishlistProducts() {
    try {
      // const response = await getWishlistProductsAPI(undefined, apiInstance);
      const response = await apiClient.invoke(
        "readCustomerWishlist post /customer/wishlist",
        {},
      );
      _wishlistItems.value = [
        // TODO [OpenAPI][WishlistLoadRouteResponse] - products should be `ProductListingResult` not `ProductListingResult[]` and (probably) required field
        ...(response.products as unknown as Schemas["ProductListingResult"])!.elements!.map(
          (element: Schemas["Product"]) => element.id as string,
        ), // TODO: [OpenAPI][Product] - `id` should be required field in Product schema
      ];
    } catch (e) {
      const error = e as ClientApiError;
      // If 404 ignore printing error and reset wishlist
      if (error?.statusCode !== 404) console.error(error);
      _wishlistItems.value = [];
    }
  }

  async function mergeWishlistProducts(productIds: string[]) {
    await apiClient.invoke(
      "mergeProductOnWishlist post /customer/wishlist/merge",
      {
        productIds,
      },
    );
  }

  const items = computed(() => _wishlistItems.value);
  const count = computed(() => items.value.length);

  return {
    getWishlistProducts,
    addToWishlistSync,
    removeFromWishlistSync,
    mergeWishlistProducts,
    items,
    count,
  };
}
