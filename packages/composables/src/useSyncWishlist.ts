import { ref, Ref, computed, ComputedRef } from "vue";
import {
  addWishlistProduct,
  getWishlistProducts as getWishlistProductsAPI,
  removeWishlistProduct,
  mergeWishlistProducts as mergeWishlistProductsAPI,
} from "@shopware-pwa/api-client";
import { useShopwareContext } from "./useShopwareContext";
import { ClientApiError } from "@shopware-pwa/types";

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
  const { apiInstance } = useShopwareContext();

  async function addToWishlistSync(id: string) {
    await addWishlistProduct(id, apiInstance);
  }

  async function removeFromWishlistSync(id: string) {
    await removeWishlistProduct(id, apiInstance);
  }

  /**
   * Fetch wishlist items
   * Only for logged-in users
   */
  async function getWishlistProducts() {
    try {
      const response = await getWishlistProductsAPI(undefined, apiInstance);
      _wishlistItems.value = [
        ...response.products.elements.map((element) => element.id),
      ];
    } catch (e) {
      const error = e as ClientApiError;
      // If 404 ignore printing error and reset wishlist
      if (error?.statusCode !== 404) console.error(error);
      _wishlistItems.value = [];
    }
  }

  async function mergeWishlistProducts(itemsToMerge: string[]) {
    await mergeWishlistProductsAPI(itemsToMerge, apiInstance);
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
