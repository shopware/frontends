import { computed } from "vue";
import type { Ref } from "vue";
import { useUser, useLocalWishlist, useSyncWishlist } from "#imports";

export type UseProductWishlistReturn = {
  /**
   * Removes product from wishlist
   */
  removeFromWishlist(): Promise<void>;
  /**
   * Adds product to wishlist
   */
  addToWishlist(): Promise<void>;
  /**
   * Indicates whether a product is in wishlist
   */
  isInWishlist: Ref<boolean>;
};

/**
 * Manage wishlist for a single product.
 *
 * @public
 * @category Product
 */
export function useProductWishlist(
  productId: string,
): UseProductWishlistReturn {
  const { isLoggedIn } = useUser();
  const {
    addToWishlist: addItem,
    removeFromWishlist: removeItem,
    items,
  } = useLocalWishlist();

  const {
    addToWishlistSync: addItemSync,
    removeFromWishlistSync: removeItemSync,
    items: itemsSync,
    getWishlistProducts,
  } = useSyncWishlist();

  // removes item from the list
  async function removeFromWishlist() {
    if (isLoggedIn.value) {
      await removeItemSync(productId);
      await getWishlistProducts();
    } else {
      await removeItem(productId);
    }
  }

  async function addToWishlist() {
    if (isLoggedIn.value) {
      await addItemSync(productId);
      await getWishlistProducts();
    } else {
      await addItem(productId);
    }
  }

  // return true or false if product id is in wishlist array
  const isInWishlist = computed(() =>
    isLoggedIn.value
      ? itemsSync.value?.includes(productId)
      : items.value?.includes(productId),
  );

  return {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
}
