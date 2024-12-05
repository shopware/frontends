import { defu } from "defu";
import { useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";
import { cmsAssociations } from "../cms/cmsAssociations";

type UseProductSearchReturnOptions = {
  withCmsAssociations?: boolean;
  criteria?: Partial<Schemas["Criteria"]>;
  associations?: Partial<Schemas["Association"]>;
};

export type UseProductSearchReturn = {
  /**
   * Searches for a product by its id
   * @param productId
   * @param options - optional parameters accepts `withCmsAssociations` flag to fetch cms-related associations and criteria
   * @returns {Promise<Schemas['ProductDetailResponse']>}
   */
  search: (
    productId: string,
    options?: UseProductSearchReturnOptions,
  ) => Promise<Schemas["ProductDetailResponse"]>;
};

/**
 * Composable for product search.
 * @public
 * @category Navigation & Routing
 */
export function useProductSearch(): UseProductSearchReturn {
  const { apiClient } = useShopwareContext();

  const search = async (
    productId: string,
    options?: UseProductSearchReturnOptions,
  ) => {
    const associations = defu(
      options?.withCmsAssociations ? cmsAssociations : {},
      options?.criteria,
      { associations: options?.associations ?? {} },
    );
    const result = await apiClient.invoke(
      "readProductDetail post /product/{productId}",
      {
        headers: {
          "sw-include-seo-urls": true,
        },
        pathParams: { productId },
        body: associations,
      },
    );
    return result.data;
  };

  return {
    search,
  };
}
