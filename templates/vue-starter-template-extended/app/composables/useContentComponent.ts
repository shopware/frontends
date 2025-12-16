import { type Component, resolveComponent } from "vue";
import type { Schemas } from "#shopware";
import { parseComponentType } from "./contentHelpers";

export type ContentComponentResolution = {
  componentName: string;
  resolvedComponent: Component | undefined;
  isResolved: boolean;
  error?: string;
};

/**
 * Composable for resolving content component types to Vue components
 *
 * Converts content element component types (e.g., "Sw:Content:Text") to
 * Vue component names (e.g., "ContentText") and resolves them.
 *
 * @example
 * ```ts
 * const { resolveContentComponent } = useContentComponent();
 * const element = { component: "Sw:Content:Text", ... };
 * const { componentName, resolvedComponent, isResolved } = resolveContentComponent(element);
 * ```
 *
 * @public
 * @category Content
 */
export function useContentComponent() {
  /**
   * Resolve a content element to its Vue component
   * @param element - Content element to resolve
   * @returns Resolution result with component name and resolved component
   */
  function resolveContentComponent(
    element: Schemas["ContentElement"],
  ): ContentComponentResolution {
    const { category, name } = parseComponentType(element.component);

    // Build component name from parsed type
    // Examples:
    // - "Sw:Content:Text" => "ContentText" (skip "Content" category as it's redundant)
    // - "Sw:Product:Card" => "ContentProductCard" (include "Product" category)
    // - "Sw:Grid" => "ContentGrid"
    const componentName =
      category && category !== "Content"
        ? `Content${category}${name}`
        : `Content${name}`;

    try {
      const resolved = resolveComponent(componentName);

      return {
        componentName,
        resolvedComponent: typeof resolved !== "string" ? resolved : undefined,
        isResolved: typeof resolved !== "string",
      };
    } catch (e) {
      return {
        componentName,
        resolvedComponent: undefined,
        isResolved: false,
        error: (e as Error).message,
      };
    }
  }

  /**
   * Get the expected component name for a content element
   * without attempting to resolve it
   * @param componentType - Component type string (e.g., "Sw:Content:Text")
   * @returns Expected Vue component name
   */
  function getComponentName(componentType: string): string {
    const { category, name } = parseComponentType(componentType);

    return category && category !== "Content"
      ? `Content${category}${name}`
      : `Content${name}`;
  }

  return {
    resolveContentComponent,
    getComponentName,
  };
}
