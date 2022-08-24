import { ref, Ref, UnwrapRef, reactive, unref } from "vue";
import {
  getProductReviews,
  addProductReview,
} from "@shopware-pwa/shopware-6-client";
// import { useDefaults, getApplicationContext } from "@shopware-pwa/composables";
import {
  ClientApiError,
  Product,
  ProductReview,
  ShopwareError,
  ShopwareSearchParams,
} from "@shopware-pwa/types";
import { useShopwareContext } from "./useShopwareContext";

/**
 * interface for {@link useProductReviews} composable
 *
 * @beta
 */
export interface IUseProductReviews {
  productReviews: Ref<ProductReview[] | null>;
  errors: UnwrapRef<{
    loadProductReviews: ShopwareError[];
    addReview: ShopwareError[];
  }>;
  wasReviewSent: Ref<boolean>;
  isSendingReview: Ref<boolean>;
  loadingReviews: Ref<boolean>;
  addReview: (data: {
    title: string;
    content: string;
    points: number;
  }) => Promise<void>;
  loadProductReviews: (parameters?: ShopwareSearchParams) => Promise<void>;
}

/**
 * Composable for listing customer orders. Options - {@link IUseProductReviews}
 *
 * @beta
 */
export function useProductReviews(params: {
  product: Ref<Product> | Product;
}): IUseProductReviews {
  const COMPOSABLE_NAME = "useProductReviews";
  const contextName = COMPOSABLE_NAME;

  const product = unref(params.product);
  const { apiInstance } = useShopwareContext();
  // const { getDefaults } = useDefaults({ defaultsKey: contextName });

  const wasReviewSent = ref(false);
  const isSendingReview = ref(false);
  const loadingReviews = ref(false);

  const errors: UnwrapRef<{
    loadProductReviews: ShopwareError[];
    addReview: ShopwareError[];
  }> = reactive({
    loadProductReviews: [],
    addReview: [],
  });
  const productReviews: Ref<ProductReview[] | null> = ref(null);

  const loadProductReviews = async (
    parameters: ShopwareSearchParams = {}
  ): Promise<void> => {
    try {
      loadingReviews.value = true;
      const fetchedReviews = await getProductReviews(
        product.id,
        undefined,
        // Object.assign({}, getDefaults(), parameters),
        apiInstance
      );
      productReviews.value = fetchedReviews.elements ?? [];
      loadingReviews.value = false;
    } catch (e) {
      const err = e as ClientApiError;
      errors.loadProductReviews = err.messages;
      loadingReviews.value = false;
    }
  };

  const addReview = async (data: {
    title: string;
    content: string;
    points: number;
  }) => {
    isSendingReview.value = true;
    try {
      await addProductReview(product.id, data, apiInstance);
      wasReviewSent.value = true;
    } catch (e) {
      const error = e as ClientApiError;
      console.error("[SwAddProductReview][submitForm]: ", error);
      errors.addReview = error.messages;
    }
    isSendingReview.value = false;
  };

  return {
    productReviews,
    loadProductReviews,
    wasReviewSent,
    addReview,
    isSendingReview,
    errors,
    loadingReviews,
  };
}
