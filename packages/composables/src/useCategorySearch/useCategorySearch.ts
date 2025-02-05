import { useSessionContext, useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";
import { cmsAssociations } from "../cms/cmsAssociations";

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
  const { currentSessionLanguageID } = useSessionContext();

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
          "sw-language-id": currentSessionLanguageID.value,
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
      headers: {
        "sw-language-id": currentSessionLanguageID.value,
      },
    });
    return result.data.elements ?? [];
  }

  return {
    search,
    advancedSearch,
  };
}
