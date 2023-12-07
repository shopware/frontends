import { useShopwareContext } from "#imports";
import { cmsAssociations } from "./cms/cmsAssociations";
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
    const result = apiClient.invoke(
      "readCategory post /category/{navigationId}?slots sw-include-seo-urls",
      {
        navigationId: categoryId,
        "sw-include-seo-urls": true,
        associations,
        ...options?.query,
      },
    );
    return result;
  }

  async function advancedSearch(options: {
    withCmsAssociations?: boolean;
    query: Schemas["Criteria"];
  }) {
    const associations = options?.withCmsAssociations
      ? cmsAssociations.associations
      : {};
    const result = await apiClient.invoke("readCategoryList post /category", {
      associations,
      ...options?.query,
    });
    return result.elements ?? [];
  }

  return {
    search,
    advancedSearch,
  };
}
