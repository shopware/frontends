import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";
import { useShopwareContext } from "#imports";
import { ApiClientError } from "@shopware/api-client";
import type { RequestParameters } from "#shopware";

export type UseSyncWishlistReturn = {
  /**
   * Get products from wishlist
   */
  getWishlistProducts(
    defaultPaginationCriteria?: RequestParameters<"searchPage">,
  ): void;
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
  totalWishlistItemsCount: Ref<number>;
};

const _wishlistItems: Ref<string[]> = ref([]);
const totalWishlistItemsCount: Ref<number> = ref(15);

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
  async function getWishlistProducts(
    defaultSearchCriteria?: RequestParameters<"searchPage">,
  ) {
    try {
      const response = await apiClient.invoke(
        "readCustomerWishlist post /customer/wishlist",
        { ...defaultSearchCriteria },
      );
      _wishlistItems.value = [
        ...response.products.elements.map((element) => element.id),
      ];
      totalWishlistItemsCount.value = response.products.total!;
    } catch (e) {
      if (e instanceof ApiClientError) {
        // If 404 ignore printing error and reset wishlist
        if (e.status !== 404) console.error(e);
        _wishlistItems.value = [];
      }
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

  return {
    getWishlistProducts,
    addToWishlistSync,
    removeFromWishlistSync,
    mergeWishlistProducts,
    items,
    totalWishlistItemsCount,
  };
}
