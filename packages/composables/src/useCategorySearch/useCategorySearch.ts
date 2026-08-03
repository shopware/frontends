import { encodeForQuery } from "@shopware/api-client/helpers";

import { useShopwareContext } from "#imports";
import type { Schemas, operations } from "#shopware";

import { cmsAssociations } from "../cms/cmsAssociations";

type ReadCategoryGetQuery = NonNullable<
  operations["readCategoryGet get /category/{navigationId}"]["query"]
> & { _criteria?: string };

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
  const { apiClient, cacheableReads } = useShopwareContext();

  async function search(
    categoryId: string,
    options?: {
      withCmsAssociations?: boolean;
      query?: Schemas["Criteria"];
    },
  ) {
    const associations = options?.withCmsAssociations ? cmsAssociations : {};
    const criteria = {
      associations,
      ...options?.query,
    };
    const result = cacheableReads
      ? await apiClient.invoke("readCategoryGet get /category/{navigationId}", {
          pathParams: {
            navigationId: categoryId,
          },
          headers: {
            "sw-include-seo-urls": true,
          },
          query: {
            _criteria: encodeForQuery(criteria),
          } as ReadCategoryGetQuery,
        })
      : await apiClient.invoke("readCategory post /category/{navigationId}", {
          pathParams: {
            navigationId: categoryId,
          },
          headers: {
            "sw-include-seo-urls": true,
          },
          body: criteria,
        });
    return result.data;
  }

  async function advancedSearch(options: {
    withCmsAssociations?: boolean;
    query: Schemas["Criteria"];
  }) {
    const associations = options?.withCmsAssociations
      ? cmsAssociations.associations
      : {};
    const criteria = {
      associations,
      ...options?.query,
    };
    const result = cacheableReads
      ? await apiClient.invoke("readCategoryListGet get /category", {
          query: { _criteria: encodeForQuery(criteria) },
        })
      : await apiClient.invoke("readCategoryList post /category", {
          body: criteria,
        });
    return result.data.elements ?? [];
  }

  return {
    search,
    advancedSearch,
  };
}
