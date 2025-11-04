import { defu } from "defu";
/**
 * Template composable
 */
import { computed, ref } from "vue";
import type { ComputedRef } from "vue";
import { useLocalWishlist, useSyncWishlist, useUser } from "#imports";
import type { Schemas } from "#shopware";

export type UseWishlistReturn = {
  /**
   * Merge products with wishlist between async (API) and sync (localstorage) wishlists
   */
  mergeWishlistProducts(): void;
  /**
   * Get products list added to wishlist
   */
  getWishlistProducts(query?: Schemas["Criteria"]): Promise<void>;
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
  currentPage: ComputedRef<number>;
  /**
   * total pages count
   */
  totalPagesCount: ComputedRef<number>;
  /**
   * total wishlist items count
   */
  count: ComputedRef<number>;
  /**
   * Indicates if the wishlist can be synced
   */
  canSyncWishlist: ComputedRef<boolean>;
  /**
   * Wishlist products
   */
  productsSync: ComputedRef<Schemas["Product"][]>;
  /**
   * Limit number of products per page
   */
  limit: ComputedRef<number>;
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
    count: countSync,
    currentPage,
    products: productsSync,
    limit: limitSync,
  } = useSyncWishlist();

  const limit = ref<number>(15);

  const getWishlistProducts = async (query?: Schemas["Criteria"]) => {
    let wishlistQuery = {
      limit: limit.value,
    } as Schemas["Criteria"];

    wishlistQuery = defu(query, wishlistQuery);

    if (query?.limit) {
      limit.value = query.limit;
    }

    if (canSyncWishlist.value) {
      await getWishlistProductsSync(wishlistQuery);
    } else {
      getWishlistProductsLocal();
    }
  };

  const items = computed(() =>
    canSyncWishlist.value ? itemsSync.value : itemsLocal.value,
  );

  const totalPagesCount = computed(() => Math.ceil(count.value / limit.value));

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

  const count = computed(() => {
    if (canSyncWishlist.value) {
      return countSync.value;
    }
    return items.value.length;
  });

  return {
    mergeWishlistProducts,
    getWishlistProducts,
    clearWishlist,
    items,
    currentPage,
    totalPagesCount,
    count,
    canSyncWishlist,
    productsSync,
    limit: limitSync,
  };
}
