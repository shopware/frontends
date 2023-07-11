import {
  getProductEndpoint,
  getProductDetailsEndpoint,
  getProductListingEndpoint,
  getProductReviewsEndpoint,
} from "../endpoints";
import {
  ProductListingResult,
  Product,
  ShopwareSearchParams,
  ProductResponse,
  EntityResult,
  ProductReview,
} from "@shopware-pwa/types";

import { defaultInstance, ShopwareApiInstance } from "../apiService";

/**
 * Get default amount of products
 *
 * @param {ShopwareSearchParams} criteria search criteria for products
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Product
 * @public
 */
export async function getProducts(
  criteria?: ShopwareSearchParams,
  contextInstance: ShopwareApiInstance = defaultInstance,
) {
  const resp = await contextInstance.invoke.post<
    EntityResult<"product", Product>
  >(`${getProductEndpoint()}`, {
    ...(criteria || {}),
  });
  return resp.data;
}

/**
 * Get default amount of products and listing configuration for given category
 *
 * @throws ClientApiError
 * @category Product
 * @public
 */
export async function getCategoryProducts(
  categoryId: string,
  criteria?: ShopwareSearchParams,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<ProductListingResult> {
  const resp = await contextInstance.invoke.post(
    `${getProductListingEndpoint(categoryId)}`,
    criteria,
  );
  return resp.data;
}

/**
 * Get the product with passed productId
 *
 * @throws ClientApiError
 * @category Product
 * @public
 */
export async function getProduct(
  productId: string,
  params: unknown = null,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<ProductResponse> {
  const resp = await contextInstance.invoke.post(
    getProductDetailsEndpoint(productId),
    params,
  );
  return resp.data;
}

/**
 * Add a review to specific product by its ID
 *
 * @throws ClientApiError
 * @category Product
 * @public
 */
export async function addProductReview(
  productId: string,
  productReviewData: {
    title: string;
    content: string;
    points: number;
  },
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<void> {
  await contextInstance.invoke.post(
    `${getProductDetailsEndpoint(productId)}/review`,
    productReviewData,
  );
}

/**
 * Get product reviews
 *
 * @throws ClientApiError
 * @category Product
 * @public
 */
export async function getProductReviews(
  productId: string,
  criteria?: ShopwareSearchParams,
  contextInstance: ShopwareApiInstance = defaultInstance,
) {
  const resp = await contextInstance.invoke.post<
    EntityResult<"product_review", ProductReview>
  >(`${getProductReviewsEndpoint(productId)}`, {
    ...(criteria || {}),
  });
  return resp.data;
}

/**
 * Get matching product variant for given options
 *
 * @category Product
 */
export async function getProductVariantForOptions(
  {
    productId,
    optionIds,
    switchedGroup,
  }: { productId?: string; optionIds?: string[]; switchedGroup?: string },
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<{
  variantId: string;
  options: string[];
}> {
  const response = await contextInstance.invoke.post<{
    variantId: string;
    options: string[];
  }>(`/store-api/product/${productId}/find-variant`, {
    options: optionIds,
    switchedGroup,
  });

  return response?.data;
}
