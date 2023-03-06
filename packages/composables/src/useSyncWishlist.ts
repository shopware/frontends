import { ref, Ref, computed, ComputedRef } from "vue";
import {
  addWishlistProduct,
  getWishlistProducts as getWishlistProductsAPI,
  removeWishlistProduct,
  mergeWishlistProducts as mergeWishlistProductsAPI,
} from "@shopware-pwa/api-client";
import { useShopwareContext } from "./useShopwareContext";

export type UseSyncWishlistReturn = {
  getWishlistProducts: () => void;
  mergeWishlistProducts: (itemsToMerge: string[]) => void;
  addToWishlistSync: (id: string) => void;
  removeFromWishlistSync: (id: string) => void;
  items: ComputedRef<string[]>;
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
    getWishlistProducts();
  }

  async function removeFromWishlistSync(id: string) {
    await removeWishlistProduct(id, apiInstance);
    getWishlistProducts();
  }

  /**
   * Fetch wishlist items
   * Only for logged-in users
   */
  async function getWishlistProducts() {
    const response = await getWishlistProductsAPI(undefined, apiInstance);
    _wishlistItems.value = [
      ...response.products.elements.map((element) => element.id),
    ];
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
