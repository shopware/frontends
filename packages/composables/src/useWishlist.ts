/**
 * Template composable
 */
import { computed, ref } from "vue";
import type { ComputedRef, Ref } from "vue";
import { useUser, useLocalWishlist, useSyncWishlist } from "#imports";
import type { RequestParameters } from "#shopware";

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
   * Changes the current page number
   * @param pageNumber - page number to change to
   * @returns
   */
  changeCurrentPage(
    page: number,
    query?: RequestParameters<"searchPage">,
  ): Promise<void>;
  /**
   * Current page number
   */
  getCurrentPage: ComputedRef<number>;
  /**
   * total pages count
   */
  getTotalPagesCount: ComputedRef<number>;
  /**
   * total wishlist items count
   */
  totalWishlistItemsCount: Ref<number>;
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
    totalWishlistItemsCount,
  } = useSyncWishlist();

  const currentPage = ref<number>(1);
  const limit = ref<number>(15);

  const getWishlistProducts = async () => {
    if (canSyncWishlist.value) {
      await getWishlistProductsSync({
        page: currentPage.value,
        limit: limit.value,
        p: currentPage.value,
      } as unknown as RequestParameters<"searchPage">);
    } else {
      await getWishlistProductsLocal();
    }
  };

  const changeCurrentPage = async (
    page: number,
    query: RequestParameters<"searchPage">,
  ) => {
    currentPage.value = page;
    if (query.limit) {
      limit.value = +query.limit;
    }
    await getWishlistProductsSync({ ...query, page });
  };

  const getTotalPagesCount = computed(() =>
    Math.ceil(totalWishlistItemsCount.value / limit.value),
  );

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

  const items = computed(() =>
    canSyncWishlist.value ? itemsSync.value : itemsLocal.value,
  );

  const getCurrentPage = computed(() => currentPage.value);

  return {
    mergeWishlistProducts,
    getWishlistProducts,
    clearWishlist,
    items,
    changeCurrentPage,
    getCurrentPage,
    getTotalPagesCount,
    totalWishlistItemsCount,
  };
}
