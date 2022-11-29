/**
 * Template composable
 */
import { computed, ComputedRef } from "vue";
import { useUser } from "./useUser";
import { useLocalWishlist } from "./useLocalWishlist";
import { useSyncWishlist } from "./useSyncWishlist";

export type UseWishlistReturn = {
  mergeWishlistProducts: () => void;
  getWishlistProducts: () => void;
  clearWishlist: () => void;
  items: ComputedRef<string[]>;
  count: ComputedRef<number>;
};

export function useWishlist(): UseWishlistReturn {
  const { isLoggedIn } = useUser();
  const {
    getWishlistProducts: getWishlistProductsLocal,
    items: itemsLocal,
    clearWishlist: clearWishlistLocal,
  } = useLocalWishlist();
  const {
    getWishlistProducts: getWishlistProductsSync,
    items: itemsSync,
    mergeWishlistProducts: mergeWishlistProductsSync,
  } = useSyncWishlist();

  const getWishlistProducts = async () => {
    if (isLoggedIn.value) {
      await getWishlistProductsSync();
    } else {
      await getWishlistProductsLocal();
    }
  };

  const clearWishlist = () => {
    clearWishlistLocal();
  };

  const mergeWishlistProducts = async () => {
    if (itemsLocal.value?.length) {
      await mergeWishlistProductsSync(itemsLocal.value);
      clearWishlist();
    }
    getWishlistProductsSync();
  };

  const items = computed(() =>
    isLoggedIn.value ? itemsSync.value : itemsLocal.value
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
