import { Ref, computed, ComputedRef } from "vue";
import { RouteName, SeoUrl } from "@shopware-pwa/types";
import { _parseUrlQuery } from "@shopware-pwa/helpers-next";
import { _useContext } from "./internal/_useContext";

export type UseNavigationContextReturn = {
  /**
   * SEO URL from the navigation context
   */
  navigationContext: ComputedRef<SeoUrl | null>;
  /**
   * Route name from the navigation context
   */
  routeName: ComputedRef<RouteName | undefined>;
  /**
   * Foreign key (ID) for current navigation context
   */
  foreignKey: ComputedRef<string>;
};

/**
 * Composable to get navigation context from the URL.
 * @public
 * @category Navigation & Routing
 */
export function useNavigationContext(
  context?: Ref<SeoUrl | null>,
): UseNavigationContextReturn {
  const _context = _useContext("navigation", { context: context });

  const routeName = computed(() => _context.value?.routeName);
  const foreignKey = computed(() => _context.value?.foreignKey || "");

  return {
    navigationContext: computed(() => _context.value),
    routeName,
    foreignKey,
  };
}
