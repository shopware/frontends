import { computed } from "vue";
import type { Ref } from "vue";
import type { Product } from "@shopware-pwa/types";
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
 * @public
 * @category Product
 */
export function useProductWishlist(
  product: Ref<Product>,
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
      await removeItemSync(product.value.id as string); // TODO: [OpenAPI][Product] - `id` should be required field in Product schema
      await getWishlistProducts();
    } else {
      await removeItem(product.value.id as string); // TODO: [OpenAPI][Product] - `id` should be required field in Product schema
    }
  }

  async function addToWishlist() {
    if (isLoggedIn.value) {
      await addItemSync(product.value.id as string); // TODO: [OpenAPI][Product] - `id` should be required field in Product schema
      await getWishlistProducts();
    } else {
      await addItem(product.value.id as string); // TODO: [OpenAPI][Product] - `id` should be required field in Product schema
    }
  }

  // return true or false if product id is in wishlist array
  const isInWishlist = computed(
    () =>
      isLoggedIn.value
        ? itemsSync.value?.includes(product.value.id as string) // TODO: [OpenAPI][Product] - `id` should be required field in Product schema
        : items.value?.includes(product.value.id as string), // TODO: [OpenAPI][Product] - `id` should be required field in Product schema
  );

  return {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
}
