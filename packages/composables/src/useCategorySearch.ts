import { computed, ComputedRef, inject, provide, ref, Ref, unref } from "vue";
import {
  invokePost,
  getCategoryDetailsEndpoint,
} from "@shopware-pwa/api-client";
import { Category, ShopwareSearchParams } from "@shopware-pwa/types";
import { useShopwareContext } from "./useShopwareContext";
import { cmsAssociations } from "./cms/cmsAssociations";
import { _useContext } from "./internal/_useContext";

export type UseCategorySearchReturn = {
  search: (
    categoryId: string,
    options?: {
      withCmsAssociations?: boolean;
      query?: Partial<ShopwareSearchParams>;
    }
  ) => Promise<Category>;
};

/**
 * Composable for category search.
 * @public
 * @category Navigation & Routing
 */
export function useCategorySearch(): UseCategorySearchReturn {
  const { apiInstance } = useShopwareContext();

  async function search(
    categoryId: string,
    options?: {
      withCmsAssociations?: boolean;
      query?: Partial<ShopwareSearchParams>;
    }
  ) {
    const associations = options?.withCmsAssociations ? cmsAssociations : {};
    const result = await invokePost<Category>(
      {
        address: getCategoryDetailsEndpoint(categoryId),
        payload: { associations, ...options?.query },
      },
      apiInstance
    );
    return result.data;
  }

  return {
    search,
  };
}
