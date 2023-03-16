import { getSuggestSearchEndpoint, getSearchEndpoint } from "../endpoints";
import { defaultInstance, ShopwareApiInstance } from "../apiService";
import {
  ProductListingResult,
  ShopwareSearchParams,
} from "@shopware-pwa/types";

/**
 * Search for products based on criteria.
 * From: Shopware 6.4
 *
 * @param {ShopwareSearchParams} criteria search criteria for products
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @category Search
 * @public
 */
export async function searchProducts(
  criteria?: ShopwareSearchParams,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<ProductListingResult> {
  const resp = await contextInstance.invoke.post(
    `${getSearchEndpoint()}?search=${encodeURIComponent(
      criteria?.query || ""
    )}`,
    criteria
  );

  return resp.data;
}

/**
 * Search for suggested products based on criteria.
 * From: Shopware 6.4
 *
 * @param {ShopwareSearchParams} criteria search criteria for products
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @category Search
 * @public
 */
export async function searchSuggestedProducts(
  criteria?: ShopwareSearchParams,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<ProductListingResult> {
  const resp = await contextInstance.invoke.post(
    `${getSuggestSearchEndpoint()}?search=${encodeURIComponent(
      criteria?.query || ""
    )}`,
    criteria
  );

  return resp.data;
}
