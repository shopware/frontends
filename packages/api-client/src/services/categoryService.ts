import { getCategoryEndpoint, getCategoryDetailsEndpoint } from "../endpoints";
import {
  Category,
  EntityResult,
  ShopwareSearchParams,
} from "@shopware-pwa/types";
import { defaultInstance, ShopwareApiInstance } from "../apiService";

/**
 * Get a list of categories by provided search criteria.
 * 
 * @param {ShopwareSearchParams} search criteria search criteria for categories
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 * 
 * @throws ClientApiError
 * @category Category
 * @public
 */
export async function getCategories(
  searchCriteria?: ShopwareSearchParams,
  contextInstance: ShopwareApiInstance = defaultInstance
) {
  const resp = await contextInstance.invoke.post<
    EntityResult<"category", Category>
  >(getCategoryEndpoint(), searchCriteria);

  return resp.data;
}

/**
 * Get a single category by its id.
 * 
 * @param {string} categoryId id of the category
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 * 
 * @throws ClientApiError
 * @category Category
 * @public
 */
export async function getCategory(
  categoryId: string,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<Category> {
  const resp = await contextInstance.invoke.get(
    getCategoryDetailsEndpoint(categoryId)
  );

  return resp.data;
}
