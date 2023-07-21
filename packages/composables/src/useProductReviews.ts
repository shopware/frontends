import { ref, Ref, ComputedRef, computed } from "vue";
import { getProductReviews, addProductReview } from "@shopware-pwa/api-client";
// import { useDefaults, getApplicationContext } from "@shopware-pwa/composables";
import {
  Product,
  ProductReview,
  ShopwareSearchParams,
} from "@shopware-pwa/types";
import { useShopwareContext } from "./useShopwareContext";

export type UseProductReviewsReturn = {
  /**
   * All reviews added to the product
   */
  productReviews: ComputedRef<ProductReview[]>;
  /**
   * Adds a review to the product
   * @param data `title` - review title, `content` - review content, `points` - review points (range of 1-5)
   * @returns
   */
  addReview(data: {
    title: string;
    content: string;
    points: number;
  }): Promise<void>;
  /**
   * Fetches the reviews list and assigns the result to the `productReviews` property
   * @param parameters {@link ShopwareSearchParams}
   * @returns
   */
  loadProductReviews(parameters?: ShopwareSearchParams): Promise<void>;
};

/**
 * Composable for listing customer orders.
 * @public
 * @category Product
 */
export function useProductReviews(
  product: Ref<Product>,
): UseProductReviewsReturn {
  const { apiInstance } = useShopwareContext();

  const productReviews: Ref<ProductReview[]> = ref([]);

  const loadProductReviews = async (
    parameters: ShopwareSearchParams = {},
  ): Promise<void> => {
    const fetchedReviews = await getProductReviews(
      product.value.id,
      undefined,
      // Object.assign({}, getDefaults(), parameters),
      apiInstance,
    );
    productReviews.value = fetchedReviews.elements ?? [];
  };

  const addReview = async (data: {
    title: string;
    content: string;
    points: number;
  }) => {
    await addProductReview(product.value.id, data, apiInstance);
  };

  return {
    productReviews: computed(() => productReviews.value),
    loadProductReviews,
    addReview,
  };
}
