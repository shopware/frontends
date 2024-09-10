import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";

export type UseLocalWishlistReturn = {
  /**
   * Get wishlist products from localstorage
   */
  getWishlistProducts(): void;
  /**
   * Add product to wishlist by its id
   */
  addToWishlist(id: string): Promise<void>;
  /**
   * Remove product from wishlist by its id
   */
  removeFromWishlist(id: string): Promise<void>;
  /**
   * Remove all products from wishlist
   */
  clearWishlist(): Promise<void>;
  /**
   * List of wishlist items
   */
  items: ComputedRef<string[]>;
  /**
   * Count of wishlist items
   */
  count: ComputedRef<number>;
};

const _wishlistItems: Ref<string[]> = ref([]);

/**
 * Composable for wishlist management.
 * @public
 * @category Wishlist
 */
export function useLocalWishlist(): UseLocalWishlistReturn {
  // update wishlist in localstorage
  const updateStorage = (): void => {
    localStorage.setItem(
      "sw-wishlist-items",
      JSON.stringify(_wishlistItems.value),
    );
  };
  /* istanbul ignore next */
  const getFromStorage = () => {
    if (typeof window !== "undefined" && localStorage) {
      return JSON.parse(localStorage.getItem("sw-wishlist-items") ?? "[]");
    }
  };

  // removes item from the list
  async function removeFromWishlist(id: string) {
    _wishlistItems.value = _wishlistItems.value?.filter(
      (itemId: string) => itemId !== id,
    );

    updateStorage();
  }

  // add product id to wishlist array and trigger to update localstorage
  async function addToWishlist(id: string) {
    if (!_wishlistItems.value.includes(id)) {
      _wishlistItems.value.push(id);

      updateStorage();
    }
  }

  // remove all items from wishlist
  async function clearWishlist() {
    _wishlistItems.value = [];
    updateStorage();
  }

  function getWishlistProducts() {
    const currentWishlist = getFromStorage();
    if (Array.isArray(currentWishlist) && currentWishlist.length) {
      _wishlistItems.value = currentWishlist;
    }
  }

  const items = computed(() => _wishlistItems.value);
  const count = computed(() => items.value.length);

  return {
    getWishlistProducts,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    items,
    count,
  };
}
