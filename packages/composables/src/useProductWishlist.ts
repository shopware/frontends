import { Ref, computed } from "vue";
import { Product } from "@shopware-pwa/types";
import { useWishlist } from "./useWishlist";

export type UseProductWishlistReturn = {
  removeFromWishlist: () => Promise<void>;
  addToWishlist: () => Promise<void>;
  isInWishlist: Ref<boolean>;
};

/**
 * Manage wishlist for a single product. Options - {@link UseProductWishlistReturn}
 */
export function useProductWishlist(product: Product): UseProductWishlistReturn {
  const {
    addToWishlist: addItem,
    removeFromWishlist: removeItem,
    items,
  } = useWishlist();

  // removes item from the list
  async function removeFromWishlist() {
    await removeItem(product.id);
  }

  // add product id to wishlist array and trigger to update localstorage

  async function addToWishlist() {
    await addItem(product.id);
  }

  // return true or false if product id is in wishlist array
  const isInWishlist = computed(() => {
    return items.value?.includes(product.id);
  });

  return {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
}
