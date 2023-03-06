import { Ref, computed } from "vue";
import { Product } from "@shopware-pwa/types";
import { useUser } from "./useUser";
import { useLocalWishlist } from "./useLocalWishlist";
import { useSyncWishlist } from "./useSyncWishlist";

export type UseProductWishlistReturn = {
  removeFromWishlist: () => Promise<void>;
  addToWishlist: () => Promise<void>;
  isInWishlist: Ref<boolean>;
};

/**
 * Manage wishlist for a single product.
 * @public
 * @category Product
 */
export function useProductWishlist(
  product: Ref<Product>
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
  } = useSyncWishlist();

  // removes item from the list
  async function removeFromWishlist() {
    if (isLoggedIn.value) {
      await removeItemSync(product.value.id);
    } else {
      await removeItem(product.value.id);
    }
  }

  async function addToWishlist() {
    if (isLoggedIn.value) {
      await addItemSync(product.value.id);
    } else {
      await addItem(product.value.id);
    }
  }

  // return true or false if product id is in wishlist array
  const isInWishlist = computed(() =>
    isLoggedIn.value
      ? itemsSync.value?.includes(product.value.id)
      : items.value?.includes(product.value.id)
  );

  return {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
}
