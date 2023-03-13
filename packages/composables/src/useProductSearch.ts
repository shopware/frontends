import { getProduct } from "@shopware-pwa/api-client";
import { ProductResponse, ShopwareSearchParams } from "@shopware-pwa/types";
import { useShopwareContext } from "./useShopwareContext";
import { cmsAssociations } from "./cms/cmsAssociations";
import { _useContext } from "./internal/_useContext";
import deepMerge from "./helpers/deepMerge";

export type UseProductSearchReturn = {
  /**
   * Searches for a product by its id
   * @param productId
   * @param options - optional parameters accepts `withCmsAssociations` flag to fetch cms-related associations and criteria
   * @returns {Promise<ProductResponse>}
   */
  search: (
    productId: string,
    options?: {
      withCmsAssociations?: boolean;
      criteria?: Partial<ShopwareSearchParams>;
    }
  ) => Promise<ProductResponse>;
};

export function useProductSearch(): {
  search: (
    productId: string,
    options?: {
      withCmsAssociations?: boolean;
      criteria?: Partial<ShopwareSearchParams>;
    }
  ) => Promise<ProductResponse>;
} {
  const { apiInstance } = useShopwareContext();

  const search = async (
    productId: string,
    options?: {
      withCmsAssociations?: boolean;
      criteria?: Partial<ShopwareSearchParams>;
    }
  ) => {
    const associations = deepMerge(
      options?.withCmsAssociations && cmsAssociations,
      options?.criteria
    );
    const result = await getProduct(productId, associations, apiInstance);
    return result;
  };

  return {
    search,
  };
}
