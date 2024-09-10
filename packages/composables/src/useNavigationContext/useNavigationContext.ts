import { computed } from "vue";
import type { Ref, ComputedRef } from "vue";
import { useContext } from "#imports";
import type { Schemas } from "#shopware";

export type UseNavigationContextReturn = {
  /**
   * SEO URL from the navigation context
   */
  navigationContext: ComputedRef<Schemas["SeoUrl"] | null>;
  /**
   * Route name from the navigation context
   */
  routeName: ComputedRef<Schemas["SeoUrl"]["routeName"] | undefined>;
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
  context?: Ref<Schemas["SeoUrl"] | null>,
): UseNavigationContextReturn {
  const _context = useContext("navigation", { context: context });

  const routeName = computed(() => _context.value?.routeName);
  const foreignKey = computed(() => _context.value?.foreignKey || "");

  return {
    navigationContext: computed(() => _context.value),
    routeName,
    foreignKey,
  };
}
