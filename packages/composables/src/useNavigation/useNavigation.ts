import { computed, inject, provide, ref } from "vue";
import type { ComputedRef, Ref } from "vue";
import { useSessionContext, useShopwareContext } from "#imports";
import type { Schemas, operations } from "#shopware";

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
  loadNavigationElements(
    params: operations["readNavigation post /navigation/{activeId}/{rootId}"]["body"],
  ): Promise<Schemas["NavigationRouteResponse"]>;
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
  const { currentSessionLanguageID } = useSessionContext();

  const sharedElements: Ref<Schemas["NavigationRouteResponse"]> = inject(
    `swNavigation-${type}`,
    ref([]),
  );
  provide(`swNavigation-${type}`, sharedElements);

  const navigationElements = computed(() => sharedElements.value);

  async function loadNavigationElements(
    params: operations["readNavigation post /navigation/{activeId}/{rootId}"]["body"],
  ) {
    try {
      const navigationResponse = await apiClient.invoke(
        "readNavigation post /navigation/{activeId}/{rootId}",
        {
          headers: {
            "sw-include-seo-urls": true,
            "sw-language-id": currentSessionLanguageID.value,
          },
          pathParams: {
            activeId: type,
            rootId: type,
          },
          body: params,
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
