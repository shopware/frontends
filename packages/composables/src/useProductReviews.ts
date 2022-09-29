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
  productReviews: ComputedRef<ProductReview[]>;
  addReview: (data: {
    title: string;
    content: string;
    points: number;
  }) => Promise<void>;
  loadProductReviews: (parameters?: ShopwareSearchParams) => Promise<void>;
};

/**
 * Composable for listing customer orders. Options - {@link UseProductReviewsReturn}
 *
 */
export function useProductReviews(product: Product): UseProductReviewsReturn {
  const { apiInstance } = useShopwareContext();

  const productReviews: Ref<ProductReview[]> = ref([]);

  const loadProductReviews = async (
    parameters: ShopwareSearchParams = {}
  ): Promise<void> => {
    const fetchedReviews = await getProductReviews(
      product.id,
      undefined,
      // Object.assign({}, getDefaults(), parameters),
      apiInstance
    );
    productReviews.value = fetchedReviews.elements ?? [];
  };

  const addReview = async (data: {
    title: string;
    content: string;
    points: number;
  }) => {
    await addProductReview(product.id, data, apiInstance);
  };

  return {
    productReviews: computed(() => productReviews.value),
    loadProductReviews,
    addReview,
  };
}
