import { getStoreNavigationEndpoint } from "../endpoints";
import { defaultInstance, ShopwareApiInstance } from "../apiService";
import {
  StoreNavigationElement,
  StoreNavigationType,
  ShopwareSearchParams,
} from "@shopware-pwa/types";

/**
 * More about the navigation parameters: https://docs.shopware.com/en/shopware-platform-dev-en/store-api-guide/navigation?category=shopware-platform-dev-en/store-api-guide
 * @category Navigation
 * @public
 */
export interface GetStoreNavigationParams {
  requestActiveId: StoreNavigationType;
  requestRootId: StoreNavigationType;
  depth?: number;
  buildTree?: boolean;
  searchCriteria?: ShopwareSearchParams;
}

/**
 * @throws ClientApiError
 * @category Navigation
 * @public
 */
export async function getStoreNavigation(
  {
    requestActiveId,
    requestRootId,
    depth,
    buildTree,
    searchCriteria,
  }: GetStoreNavigationParams,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<StoreNavigationElement[]> {
  const resp = await contextInstance.invoke.post(
    getStoreNavigationEndpoint(requestActiveId, requestRootId),
    {
      ...(searchCriteria || {}),
      ...{
        depth,
        buildTree,
      },
    }
  );

  return resp.data;
}
