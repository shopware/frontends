/**
 * Template composable
 */
import { computed, ComputedRef } from "vue";
import { useUser } from "./useUser";
import { useLocalWishlist } from "./useLocalWishlist";
import { useSyncWishlist } from "./useSyncWishlist";

export type UseWishlistReturn = {
  /**
   * Merge products with wishlist between async (API) and sync (localstorage) wishlists
   */
  mergeWishlistProducts(): void;
  /**
   * Get products list added to wishlist
   */
  getWishlistProducts(): void;
  /**
   * Clear wishlist
   */
  clearWishlist(): void;
  /**
   * Wishlist items (Product IDs)
   */
  items: ComputedRef<string[]>;
  /**
   * Wishlist items count
   */
  count: ComputedRef<number>;
};

/**
 * Composable to manage wishlist
 * @public
 * @category Wishlist
 */
export function useWishlist(): UseWishlistReturn {
  const { isLoggedIn, isGuestSession } = useUser();
  const canSyncWishlist = computed(
    () => isLoggedIn.value && !isGuestSession.value
  );

  const {
    getWishlistProducts: getWishlistProductsLocal,
    items: itemsLocal,
    clearWishlist: clearWishlistLocal,
  } = useLocalWishlist();

  const {
    getWishlistProducts: getWishlistProductsSync,
    items: itemsSync,
    mergeWishlistProducts: mergeWishlistProductsSync,
    removeFromWishlistSync,
  } = useSyncWishlist();

  const getWishlistProducts = async () => {
    if (canSyncWishlist.value) {
      await getWishlistProductsSync();
    } else {
      await getWishlistProductsLocal();
    }
  };

  const clearWishlist = async () => {
    if (canSyncWishlist.value) {
      await Promise.all(items.value.map((id) => removeFromWishlistSync(id)));
      await getWishlistProductsSync();
    } else {
      clearWishlistLocal();
    }
  };

  const mergeWishlistProducts = async () => {
    if (itemsLocal.value?.length) {
      await mergeWishlistProductsSync(itemsLocal.value);
      clearWishlist();
    }
    getWishlistProductsSync();
  };

  const items = computed(() =>
    canSyncWishlist.value ? itemsSync.value : itemsLocal.value
  );
  const count = computed(() => items.value.length);

  return {
    mergeWishlistProducts,
    getWishlistProducts,
    clearWishlist,
    items,
    count,
  };
}
