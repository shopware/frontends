import { useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";
import { cmsAssociations } from "./cms/cmsAssociations";
import { defu } from "defu";

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
      criteria?: Partial<Schemas["Criteria"]>;
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
      criteria?: Partial<Schemas["Criteria"]>;
    },
  ) => Promise<Schemas["ProductDetailResponse"]>;
} {
  const { apiClient } = useShopwareContext();

  const search = async (
    productId: string,
    options?: {
      withCmsAssociations?: boolean;
      criteria?: Partial<Schemas["Criteria"]>;
    },
  ) => {
    const associations = defu(
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
