import type { ShopwareSearchParams } from "@shopware-pwa/types";
import { useShopwareContext } from "#imports";
import { cmsAssociations } from "./cms/cmsAssociations";
import deepMerge from "./helpers/deepMerge";
import type { Schemas } from "#shopware";

export type UseProductSearchReturn = {
  /**
   * Searches for a product by its id
   * @param productId
   * @param options - optional parameters accepts `withCmsAssociations` flag to fetch cms-related associations and criteria
   * @returns {Promise<Schemas['ProductDetailResponse']>}
   */
  search: (
    productId: string,
    options?: {
      withCmsAssociations?: boolean;
      criteria?: Partial<ShopwareSearchParams>;
    },
  ) => Promise<Schemas["ProductDetailResponse"]>;
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
      criteria?: Partial<ShopwareSearchParams>;
    },
  ) => Promise<Schemas["ProductDetailResponse"]>;
} {
  const { apiClient } = useShopwareContext();

  const search = async (
    productId: string,
    options?: {
      withCmsAssociations?: boolean;
      criteria?: Partial<ShopwareSearchParams>;
    },
  ) => {
    const associations = deepMerge(
      options?.withCmsAssociations ? cmsAssociations : {},
      options?.criteria,
    );
    const result = await apiClient.invoke(
      "readProductDetail post /product/{productId}",
      {
        productId,
        ...associations,
      },
    );
    return result;
  };

  return {
    search,
  };
}
