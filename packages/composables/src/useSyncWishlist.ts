import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";
import { useShopwareContext } from "#imports";
import { ApiClientError } from "@shopware/api-client";
import type { Schemas } from "#shopware";

export type UseSyncWishlistReturn = {
  /**
   * Get products from wishlist
   */
  getWishlistProducts(
    defaultSearchCriteria?: Schemas["Criteria"],
  ): Promise<void>;
  /**
   * Merge products with wishlist already existing in API wishlist
   */
  mergeWishlistProducts(itemsToMerge: string[]): void;
  /**
   * Add product to wishlist
   */
  addToWishlistSync(id: string): void;
  /**
   * Remove product from wishlist
   */
  removeFromWishlistSync(id: string): void;
  /**
   * Wishlist items (Product IDs)
   */
  items: ComputedRef<string[]>;
  /**
   * Wishlist items count
   */
  count: ComputedRef<number>;
  /**
   * Current page number
   */
  currentPage: ComputedRef<number>;
};

const _wishlistItems: Ref<string[]> = ref([]);
const _currentPage: Ref<number> = ref(1);
const totalWishlistItemsCount: Ref<number> = ref(0);

/**
 * Composable to manage wishlist via API
 * @public
 * @category Wishlist
 */
export function useSyncWishlist(): UseSyncWishlistReturn {
  const { apiClient } = useShopwareContext();
  async function addToWishlistSync(id: string) {
    await apiClient.invoke(
      "addProductOnWishlist post /customer/wishlist/add/{productId}",
      {
        pathParams: { productId: id },
      },
    );
  }

  async function removeFromWishlistSync(id: string) {
    await apiClient.invoke(
      "deleteProductOnWishlist delete /customer/wishlist/delete/{productId}",
      {
        pathParams: { productId: id },
      },
    );
  }

  /**
   * Fetch wishlist items
   * Only for logged-in users
   */
  async function getWishlistProducts(
    defaultSearchCriteria?: Schemas["Criteria"],
  ) {
    try {
      const response = await apiClient.invoke(
        "readCustomerWishlist post /customer/wishlist",
        { body: { ...defaultSearchCriteria, "total-count-mode": "exact" } },
      );
      _wishlistItems.value = [
        ...response.data.products.elements.map((element) => element.id),
      ];
      totalWishlistItemsCount.value = response.data.products.total ?? 0;
      _currentPage.value = response.data.products.page ?? 1;
    } catch (e) {
      if (e instanceof ApiClientError) {
        // If 404 ignore printing error and reset wishlist
        if (e.status !== 404) console.error(e);
        _wishlistItems.value = [];
      }
    }
  }

  async function mergeWishlistProducts(productIds: string[]) {
    await apiClient.invoke(
      "mergeProductOnWishlist post /customer/wishlist/merge",
      {
        body: { productIds },
      },
    );
  }

  const items = computed(() => _wishlistItems.value);
  const count = computed(() => totalWishlistItemsCount.value);
  const currentPage = computed(() => _currentPage.value);

  return {
    getWishlistProducts,
    addToWishlistSync,
    removeFromWishlistSync,
    mergeWishlistProducts,
    items,
    count,
    currentPage,
  };
}
