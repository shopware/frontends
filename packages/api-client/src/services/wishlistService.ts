/**
 * WISHLIST feature must be activated in Shopware 6
 */
import {
  getAddWishlistProductEndpoint,
  getGetWishlistProductsEndpoint,
  getMergeWishlistProductsEndpoint,
  getRemoveWishlistProductEndpoint,
} from "../endpoints";
import { defaultInstance, ShopwareApiInstance } from "../apiService";
import type {
  ShopwareSearchParams,
  CustomerWishlistResponse,
} from "@shopware-pwa/types";

/**
 * Add a product with a specific ID to the wishlist
 *
 * @param {string} productId ID of the product to add to the wishlist
 * @param {ShopwareApiInstance}contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @remarks Only for logged-in users
 * @throws ClientApiError
 * @category Wishlist
 * @public
 */
export async function addWishlistProduct(
  productId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<{
  apiAlias: string;
  success: boolean;
}> {
  const resp = await contextInstance.invoke.post(
    getAddWishlistProductEndpoint(productId),
  );

  return resp.data;
}

/**
 * Fetch a current Wishlist with added products
 *
 * @param {ShopwareSearchParams} criteria search criteria for products
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @remarks Only for logged-in users
 * @throws ClientApiError
 * @category Wishlist
 * @public
 */
export async function getWishlistProducts(
  criteria?: ShopwareSearchParams,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<CustomerWishlistResponse> {
  const resp = await contextInstance.invoke.post(
    getGetWishlistProductsEndpoint(),
    criteria,
  );

  return resp.data;
}

/**
 * Delete a product with a specific ID from the wishlist
 *
 * @param {string} productId ID of the product to remove from the wishlist
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @remarks Only for logged-in users
 * @throws ClientApiError
 * @category Wishlist
 * @public
 */
export async function removeWishlistProduct(
  productId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<{
  apiAlias: string;
  success: boolean;
}> {
  const resp = await contextInstance.invoke.delete(
    getRemoveWishlistProductEndpoint(productId),
  );

  return resp.data;
}

/**
 * Merge the current Wishlist with a products with provided IDs
 *
 * @param {string[]} productIds IDs of the products to merge with the wishlist
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @remarks Only for logged-in users
 * @throws ClientApiError
 * @category Wishlist
 * @public
 */
export async function mergeWishlistProducts(
  productIds: string[],
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<{
  apiAlias: string;
  success: boolean;
}> {
  const resp = await contextInstance.invoke.post(
    getMergeWishlistProductsEndpoint(),
    { productIds },
  );

  return resp.data;
}
