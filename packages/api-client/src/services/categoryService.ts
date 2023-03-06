import { getCategoryEndpoint, getCategoryDetailsEndpoint } from "../endpoints";
import {
  Category,
  EntityResult,
  ShopwareSearchParams,
} from "@shopware-pwa/types";
import { defaultInstance, ShopwareApiInstance } from "../apiService";

/**
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
