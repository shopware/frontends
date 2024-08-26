import { computed } from "vue";
import type { ComputedRef } from "vue";
import { useContext } from "#imports";

/**
 * @internal
 */
export type Breadcrumb = {
  name: string;
  path?: string;
};

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
};

/**
 * Composable for breadcrumbs management.
 * Read the [guide](https://frontends.shopware.com//getting-started/page-elements/breadcrumbs.html#building-breadcrumbs-for-cms-pages).
 *
 * It's recommended to use [getCategoryBreadcrumbs](https://frontends.shopware.com/packages/helpers.html#getcategorybreadcrumbs) for category breadcrumbs.
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

  return {
    clearBreadcrumbs,
    breadcrumbs: computed(() => _breadcrumbs.value),
  };
}
