import { ApiClientError } from "@shopware/api-client";
import { computed, ref } from "vue";
import type { ComputedRef, Ref } from "vue";
import { useShopwareContext } from "#imports";
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
  /**
   * Limit number of products per page
   */
  limit: ComputedRef<number>;
  /**
   * Wishlist products
   */
  products: ComputedRef<Schemas["Product"][]>;
  /**
   * Indicates if the wishlist is loading
   */
  isLoading: Ref<boolean>;
};

const _wishlistItems: Ref<string[]> = ref([]);
const _wishlistProducts: Ref<Schemas["Product"][]> = ref([]);
const _currentPage: Ref<number> = ref(1);
const _limit: Ref<number> = ref(15);
const totalWishlistItemsCount: Ref<number> = ref(0);
const isLoading: Ref<boolean> = ref(false);
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
      _wishlistProducts.value = response.data.products.elements;
      totalWishlistItemsCount.value = response.data.products.total ?? 0;
      _currentPage.value = response.data.products.page ?? 1;
      _limit.value = response.data.products.limit ?? 15;
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
  const products = computed(() => _wishlistProducts.value);
  const limit = computed(() => _limit.value);

  return {
    getWishlistProducts,
    addToWishlistSync,
    removeFromWishlistSync,
    mergeWishlistProducts,
    products,
    items,
    count,
    currentPage,
    isLoading,
    limit,
  };
}
