import { getProduct } from "@shopware-pwa/api-client";
import { ProductResponse } from "@shopware-pwa/types";
import { useShopwareContext } from "./useShopwareContext";
import { cmsAssociations } from "./cms/cmsAssociations";
import { _useContext } from "./internal/_useContext";

export type UseProductSearchReturn = {
  /**
   * Searches for a product by its id
   * @param productId
   * @param options - optional parameters accepts `withCmsAssociations` flag to fetch cms-related associations
   * @returns {Promise<ProductResponse>}
   */
  search: (
    productId: string,
    options?: {
      withCmsAssociations?: boolean;
    }
  ) => Promise<ProductResponse>;
};

/**
 * Composable for product search.
 * @public
 * @category Navigation & Routing
 */
export function useProductSearch(): {
  search: (
    productId: string,
    options?: {
      withCmsAssociations?: boolean;
    }
  ) => Promise<ProductResponse>;
} {
  const { apiInstance } = useShopwareContext();

  const search = async (
    productId: string,
    options?: {
      withCmsAssociations?: boolean;
    }
  ) => {
    const associations = options?.withCmsAssociations && cmsAssociations;
    const result = await getProduct(productId, associations, apiInstance);
    return result;
  };

  return {
    search,
  };
}
