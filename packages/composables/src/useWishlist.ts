/**
 * Template composable
 */
import { computed, ref } from "vue";
import type { ComputedRef } from "vue";
import { useUser, useLocalWishlist, useSyncWishlist } from "#imports";
import type { Schemas } from "#shopware";

export type UseWishlistReturn = {
  /**
   * Merge products with wishlist between async (API) and sync (localstorage) wishlists
   */
  mergeWishlistProducts(): void;
  /**
   * Get products list added to wishlist
   */
  getWishlistProducts(
    page?: number,
    query?: Schemas["Criteria"],
  ): Promise<void>;
  /**
   * Clear wishlist
   */
  clearWishlist(): void;
  /**
   * Wishlist items (Product IDs)
   */
  items: ComputedRef<string[]>;
  /**
   * Current page number
   */
  getCurrentPage(): ComputedRef<number>;
  /**
   * total pages count
   */
  getTotalPagesCount(limit?: number): ComputedRef<number>;
  /**
   * total wishlist items count
   */
  count: ComputedRef<number>;
  /**
   * Indicates if the wishlist can be synced
   */
  canSyncWishlist: ComputedRef<boolean>;
};

/**
 * Composable to manage wishlist
 * @public
 * @category Wishlist
 */
export function useWishlist(): UseWishlistReturn {
  const { isLoggedIn, isGuestSession } = useUser();
  const canSyncWishlist = computed(
    () => isLoggedIn.value && !isGuestSession.value,
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
    count,
    currentPage,
  } = useSyncWishlist();

  const limit = ref<number>(15);

  const getWishlistProducts = async (
    page?: number,
    query?: Schemas["Criteria"],
  ) => {
    currentPage.value = page ?? 1;
    if (query?.limit) {
      limit.value = query?.limit || 15;
    }

    if (canSyncWishlist.value) {
      await getWishlistProductsSync({
        page: page,
        limit: limit.value,
      });
    } else {
      getWishlistProductsLocal();
    }
  };

  const items = computed(() =>
    canSyncWishlist.value ? itemsSync.value : itemsLocal.value,
  );

  const getTotalPagesCount = (currentLimit?: number) => {
    const pagesCount = currentLimit
      ? Math.ceil(count.value / currentLimit)
      : Math.ceil(count.value / limit.value);
    return computed(() => pagesCount);
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
    await getWishlistProductsSync();
  };

  const getCurrentPage = () => {
    return computed(() => currentPage.value);
  };

  return {
    mergeWishlistProducts,
    getWishlistProducts,
    clearWishlist,
    items,
    getCurrentPage,
    getTotalPagesCount,
    count,
    canSyncWishlist,
  };
}
