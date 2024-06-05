import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";
import { useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";

export type UseProductReviewsReturn = {
  /**
   * All reviews added to the product
   */
  productReviews: ComputedRef<Schemas["ProductReview"][]>;
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
   * @param parameters {@link Schemas["Criteria"]}
   * @returns
   */
  loadProductReviews(parameters?: Schemas["Criteria"]): Promise<void>;
};

/**
 * Composable for listing customer orders.
 * @public
 * @category Product
 */
export function useProductReviews(
  product: Ref<Schemas["Product"]>,
): UseProductReviewsReturn {
  const { apiClient } = useShopwareContext();

  const productReviews: Ref<Schemas["ProductReview"][]> = ref([]);

  const loadProductReviews = async (
    parameters: Schemas["Criteria"] = {},
  ): Promise<void> => {
    const fetchedReviews = await apiClient.invoke(
      "readProductReviews post /product/{productId}/reviews",
      {
        pathParams: { productId: product.value.id },
        body: parameters,
      },
    );
    productReviews.value = fetchedReviews.data.elements ?? [];
  };

  const addReview = async (data: {
    title: string;
    content: string;
    points: number;
  }) => {
    await apiClient.invoke(
      "saveProductReview post /product/{productId}/review",
      {
        pathParams: { productId: product.value.id },
        body: data,
      },
    );
  };

  return {
    productReviews: computed(() => productReviews.value),
    loadProductReviews,
    addReview,
  };
}
