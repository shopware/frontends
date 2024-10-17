import { computed } from "vue";
import type { ComputedRef } from "vue";
import { useContext, useShopwareContext } from "#imports";
import type { operations, Schemas } from "#shopware";

/**
 * @internal
 */
export type Breadcrumb =
  | {
      name: string;
      path?: string;
    }
  | Schemas["Breadcrumb"];

/**
 * @public
 */
export type UseBreadcrumbsReturn = {
  /**
   * Clear breadcrumbs store
   */
  clearBreadcrumbs(): void;
  /**
   * List of breadcrumbs
   */
  breadcrumbs: ComputedRef<Breadcrumb[]>;
  /**
   * Get category breadcrumbs from the API
   *
   * @param {string} categoryId
   * @returns
   */
  getCategoryBreadcrumbs: (
    categoryId: string,
  ) => Promise<operations["readBreadcrumb get /breadcrumb/{id}"]["response"]>;
  /**
   * Build breadcrumbs dynamically for a category by fetching them from the API
   *
   * @param {string} categoryId
   */
  buildDynamicBreadcrumbs(categoryId: string): Promise<void>;
};

/**
 * Composable for breadcrumbs management.
 * Read the [guide](https://frontends.shopware.com/getting-started/page-elements/breadcrumbs.html#building-breadcrumbs-for-cms-pages).
 *
 * @public
 * @category CMS (Shopping Experiences)
 */
export function useBreadcrumbs(
  newBreadcrumbs?: Breadcrumb[],
): UseBreadcrumbsReturn {
  const { apiClient } = useShopwareContext();

  // Store for breadcrumbs
  const _breadcrumbs = useContext<Breadcrumb[]>("swBreadcrumb", {
    replace: newBreadcrumbs,
  });

  /**
   * Clear breadcrumbs store
   */
  const clearBreadcrumbs = () => {
    _breadcrumbs.value = [];
  };

  const getCategoryBreadcrumbs = async (categoryId: string) => {
    const response = await apiClient.invoke(
      "readBreadcrumb get /breadcrumb/{id}",
      {
        pathParams: {
          id: categoryId,
        },
      },
    );
    return response.data;
  };

  const buildDynamicBreadcrumbs = async (categoryId: string) => {
    try {
      const breadcrumbs = await getCategoryBreadcrumbs(categoryId);
      _breadcrumbs.value = breadcrumbs.breadcrumbs;
    } catch (error) {
      console.error("Error while fetching breadcrumbs", error);
    }
  };

  return {
    clearBreadcrumbs,
    breadcrumbs: computed(() => _breadcrumbs.value),
    getCategoryBreadcrumbs,
    buildDynamicBreadcrumbs,
  };
}
