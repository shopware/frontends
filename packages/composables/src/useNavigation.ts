import { computed, ComputedRef, Ref, ref, inject, provide } from "vue";
import {
  StoreNavigationElement,
  StoreNavigationType,
} from "@shopware-pwa/types";
import { useShopwareContext } from "./useShopwareContext";
import { getStoreNavigation } from "@shopware-pwa/api-client";

/**
 *
 * Provides state for navigation trees depending on navigation type.
 */
export type UseNavigationReturn = {
  /**
   * List of navigation elements
   */
  navigationElements: ComputedRef<StoreNavigationElement[] | null>;
  /**
   * Load navigation elements
   */
  loadNavigationElements(params: {
    depth: number;
  }): Promise<StoreNavigationElement[]>;
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
  type?: StoreNavigationType;
}): UseNavigationReturn {
  const type = params?.type || "main-navigation";

  const { apiInstance } = useShopwareContext();

  const sharedElements: Ref<StoreNavigationElement[]> = inject(
    `swNavigation-${type}`,
    ref([]),
  );
  provide(`swNavigation-${type}`, sharedElements);

  const navigationElements = computed(() => sharedElements.value);

  async function loadNavigationElements({ depth }: { depth: number }) {
    try {
      const navigationResponse = await getStoreNavigation(
        {
          requestActiveId: type,
          requestRootId: type,
          searchCriteria: {
            // includes: getIncludesConfig(),
            // associations: getAssociationsConfig(),
          },
          depth,
        },
        apiInstance,
      );

      sharedElements.value = navigationResponse || [];
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
