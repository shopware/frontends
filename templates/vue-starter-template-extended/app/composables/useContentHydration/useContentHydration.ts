import type { Schemas } from "#shopware";

export type UseContentHydrationReturn = {
  /**
   * Hydrate a content skeleton with data using assignment mappings
   * @param skeleton - Content skeleton page (elements without hydrated data)
   * @param data - Deduplicated property values keyed by reference ID
   * @param assignments - Element-to-property mappings (elementId => {propKey => refId})
   * @returns Hydrated ContentPage with all properties attached to elements
   */
  hydrate: (
    skeleton: Schemas["ContentSkeletonPage"],
    data: Record<string, unknown>,
    assignments: Record<string, Record<string, string>>,
  ) => Schemas["ContentPage"];

  /**
   * Hydrate a single content element with data
   * @param element - Content element (may be from skeleton or already hydrated)
   * @param data - Deduplicated property values keyed by reference ID
   * @param assignments - Element-to-property mappings
   * @returns Hydrated ContentElement with properties attached
   */
  hydrateElement: (
    element: Schemas["ContentElement"],
    data: Record<string, unknown>,
    assignments: Record<string, Record<string, string>>,
  ) => Schemas["ContentElement"];
};

/**
 * Composable for hydrating content skeletons with data.
 *
 * When using the decomposed or skeleton+data approach, this composable
 * combines the layout structure with actual data using assignment mappings.
 *
 * The assignment object maps element IDs to property keys and their data references:
 * ```
 * {
 *   "element-123": {
 *     "title": "ref-1",
 *     "description": "ref-2"
 *   }
 * }
 * ```
 *
 * The data object contains deduplicated values keyed by reference ID:
 * ```
 * {
 *   "ref-1": "Product Title",
 *   "ref-2": "Product Description"
 * }
 * ```
 *
 * @example
 * ```ts
 * const { hydrate } = useContentHydration();
 * const { fetchSkeleton, fetchData } = useContent();
 *
 * const skeleton = await fetchSkeleton("product/123");
 * const { data, assignments } = await fetchData("product/123");
 *
 * const hydratedContent = hydrate(skeleton, data, assignments);
 * ```
 *
 * @public
 * @category Content
 */
export function useContentHydration(): UseContentHydrationReturn {
  const hydrateElement = (
    element: Schemas["ContentElement"],
    data: Record<string, unknown>,
    assignments: Record<string, Record<string, string>>,
  ): Schemas["ContentElement"] => {
    const hydratedElement = { ...element };

    // Get assignments for this element
    const elementAssignments = assignments[element.id];

    if (elementAssignments) {
      // Initialize props object if it doesn't exist
      if (!hydratedElement.props) {
        hydratedElement.props = {};
      }

      // Hydrate each property using assignments
      for (const [propKey, refId] of Object.entries(elementAssignments)) {
        if (refId in data) {
          hydratedElement.props[propKey] = data[refId];
        }
      }
    }

    // Recursively hydrate child elements in slots
    if (element.slots && !Array.isArray(element.slots)) {
      const hydratedSlots: Record<string, Schemas["ContentSlotContent"]> = {};

      for (const [slotName, slotContent] of Object.entries(element.slots)) {
        hydratedSlots[slotName] = {
          ...slotContent,
          elements: slotContent.elements.map((childElement) =>
            hydrateElement(childElement, data, assignments),
          ),
        };
      }

      hydratedElement.slots = hydratedSlots;
    }

    return hydratedElement;
  };

  const hydrate = (
    skeleton: Schemas["ContentSkeletonPage"],
    data: Record<string, unknown>,
    assignments: Record<string, Record<string, string>>,
  ): Schemas["ContentPage"] => {
    // Hydrate all root-level elements
    const hydratedElements = skeleton.elements.map((element) =>
      hydrateElement(element, data, assignments),
    );

    // Return as ContentPage with hydrated elements
    return {
      apiAlias: "content_page",
      layoutId: skeleton.layoutId,
      layoutName: skeleton.layoutName,
      layoutVersion: skeleton.layoutVersion,
      elements: hydratedElements,
    };
  };

  return {
    hydrate,
    hydrateElement,
  };
}
