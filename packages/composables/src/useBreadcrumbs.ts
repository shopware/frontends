import { ComputedRef, computed } from "vue";
import { _useContext } from "./internal/_useContext";

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
 * Read the [guide](https://shopware-frontends-docs.vercel.app/getting-started/breadcrumbs.html#building-breadcrumbs-for-cms-pages).
 *
 * It's recommended to use [getCategoryBreadcrumbs](https://shopware-frontends-docs.vercel.app/packages/helpers/getCategoryBreadcrumbs) for category breadcrumbs.
 *
 * @public
 * @category CMS (Shopping Experiences)
 */
export function useBreadcrumbs(
  newBreadcrumbs?: Breadcrumb[]
): UseBreadcrumbsReturn {
  // Store for breadcrumbs
  const _breadcrumbs = _useContext<Breadcrumb[]>("swBreadcrumb", {
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
