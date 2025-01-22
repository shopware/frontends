import { computed } from "vue";
import type { ComputedRef } from "vue";
import { useContext } from "#imports";
import type { Schemas, operations } from "#shopware";

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
   * Build breadcrumbs dynamically for a category by fetching them from the API
   *
   * @param {operations["readBreadcrumb get /breadcrumb/{id}"]["response"]} breadcrumbs
   */
  buildDynamicBreadcrumbs(
    breadcrumbs: operations["readBreadcrumb get /breadcrumb/{id}"]["response"],
  ): Promise<void>;
  /**
   * Add a breadcrumb to the breadcrumbs list
   *
   * @param {Breadcrumb} breadcrumb
   */
  pushBreadcrumb(breadcrumb: Breadcrumb): void;
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

  const pushBreadcrumb = (breadcrumb: Breadcrumb) => {
    if (_breadcrumbs.value) _breadcrumbs.value.push(breadcrumb);
    else _breadcrumbs.value = [breadcrumb];
  };

  const buildDynamicBreadcrumbs = async (
    breadcrumbs: operations["readBreadcrumb get /breadcrumb/{id}"]["response"],
  ) => {
    _breadcrumbs.value = breadcrumbs.map((breadcrumb) => {
      // Adjust path to be compatible with the router
      return {
        ...breadcrumb,
        path: `/${breadcrumb.path}`,
      };
    });
  };

  return {
    clearBreadcrumbs,
    breadcrumbs: computed(() => _breadcrumbs.value),
    buildDynamicBreadcrumbs,
    pushBreadcrumb,
  };
}
