import { useShopwareContext } from "#imports";
import { cmsAssociations } from "../cms/cmsAssociations";
import type { Schemas } from "#shopware";

export type UseCategorySearchReturn = {
  /**
   * Search for category by ID
   * Accepts optional query params and associations
   */
  search(
    categoryId: string,
    options?: {
      withCmsAssociations?: boolean;
      query?: Schemas["Criteria"];
    },
  ): Promise<Schemas["Category"]>;

  /**
   * Search based on the query
   */
  advancedSearch(options: {
    withCmsAssociations?: boolean;
    query: Schemas["Criteria"];
  }): Promise<Schemas["Category"][]>;
};

/**
 * Composable for category search.
 * @public
 * @category Navigation & Routing
 */
export function useCategorySearch(): UseCategorySearchReturn {
  const { apiClient } = useShopwareContext();

  async function search(
    categoryId: string,
    options?: {
      withCmsAssociations?: boolean;
      query?: Schemas["Criteria"];
    },
  ) {
    const associations = options?.withCmsAssociations ? cmsAssociations : {};
    const result = await apiClient.invoke(
      "readCategory post /category/{navigationId}",
      {
        pathParams: {
          navigationId: categoryId,
        },
        headers: {
          "sw-include-seo-urls": true,
        },
        body: {
          associations,
          ...options?.query,
        },
      },
    );
    return result.data;
  }

  async function advancedSearch(options: {
    withCmsAssociations?: boolean;
    query: Schemas["Criteria"];
  }) {
    const associations = options?.withCmsAssociations
      ? cmsAssociations.associations
      : {};
    const result = await apiClient.invoke("readCategoryList post /category", {
      body: {
        associations,
        ...options?.query,
      },
    });
    return result.data.elements ?? [];
  }

  return {
    search,
    advancedSearch,
  };
}
