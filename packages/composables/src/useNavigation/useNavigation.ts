import { encodeForQuery } from "@shopware/api-client/helpers";
import { computed, inject, provide, ref } from "vue";
import type { ComputedRef, Ref } from "vue";
import { useShopwareContext } from "#imports";
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

  const { apiClient, cacheableReads } = useShopwareContext();

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
      // `buildTree`/`depth` are dedicated GET query params, not part of `_criteria`.
      const { buildTree, depth, ...criteria } = params ?? {};
      const navigationResponse = cacheableReads
        ? await apiClient.invoke(
            "readNavigationGet get /navigation/{activeId}/{rootId}",
            {
              headers: {
                "sw-include-seo-urls": true,
              },
              pathParams: {
                activeId: type,
                rootId: type,
              },
              query: {
                _criteria: encodeForQuery(criteria),
                ...(buildTree !== undefined ? { buildTree } : {}),
                ...(depth !== undefined ? { depth } : {}),
              },
            },
          )
        : await apiClient.invoke(
            "readNavigation post /navigation/{activeId}/{rootId}",
            {
              headers: {
                "sw-include-seo-urls": true,
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
