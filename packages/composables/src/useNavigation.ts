import { computed, ref, inject, provide } from "vue";
import type { ComputedRef, Ref } from "vue";
import { useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";

/**
 *
 * Provides state for navigation trees depending on navigation type.
 */
export type UseNavigationReturn = {
  /**
   * List of navigation elements
   */
  navigationElements: ComputedRef<Schemas["NavigationRouteResponse"] | null>;
  /**
   * Load navigation elements
   */
  loadNavigationElements(params: {
    depth: number;
  }): Promise<Schemas["NavigationRouteResponse"]>;
};

/**
 * Composable for navigation.
 * Provides state for navigation trees depending on navigation type.
 *
 * @example
 * ```
 * // get main navigation
 * useNavigation()
 * // get footer navigation
 * useNavigation({ type: "footer-navigation" } )
 * ```
 * @public
 * @category Navigation & Routing
 */
export function useNavigation(params?: {
  type?: Schemas["NavigationType"] | string;
}): UseNavigationReturn {
  const type = params?.type || "main-navigation";

  const { apiClient } = useShopwareContext();

  const sharedElements: Ref<Schemas["NavigationRouteResponse"]> = inject(
    `swNavigation-${type}`,
    ref([]),
  );
  provide(`swNavigation-${type}`, sharedElements);

  const navigationElements = computed(() => sharedElements.value);

  async function loadNavigationElements({ depth }: { depth: number }) {
    try {
      const navigationResponse = await apiClient.invoke(
        "readNavigation post /navigation/{activeId}/{rootId}",
        {
          headers: {
            "sw-include-seo-urls": true,
          },
          pathParams: {
            activeId: type,
            rootId: type,
          },
          body: {
            depth,
          },
        },
      );

      sharedElements.value = navigationResponse.data || [];
      return sharedElements.value;
    } catch (e) {
      sharedElements.value = [];
      console.error("[useNavigation][loadNavigationElements]", e);
      return [];
    }
  }

  return {
    navigationElements,
    loadNavigationElements,
  };
}
