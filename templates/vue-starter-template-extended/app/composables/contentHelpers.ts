import type { Schemas } from "#shopware";

/**
 * Find all elements of a specific component type in the content tree
 * @param content - ContentPage or array of ContentElements
 * @param componentType - Component type to search for (e.g., "Sw:Content:Text", "Sw:Product:Card")
 * @returns Array of matching elements
 *
 * @example
 * ```ts
 * const textElements = findElementsByComponent(content, "Sw:Content:Text");
 * const productCards = findElementsByComponent(content, "Sw:Product:Card");
 * ```
 *
 * @public
 * @category Content
 */
export function findElementsByComponent(
  content: Schemas["ContentPage"] | Schemas["ContentElement"][],
  componentType: string,
): Schemas["ContentElement"][] {
  const elements = Array.isArray(content) ? content : content.elements;
  const results: Schemas["ContentElement"][] = [];

  const traverse = (element: Schemas["ContentElement"]) => {
    // Check if this element matches
    if (element.component === componentType) {
      results.push(element);
    }

    // Traverse child elements in slots
    if (element.slots && !Array.isArray(element.slots)) {
      for (const slotContent of Object.values(element.slots)) {
        slotContent.elements.forEach(traverse);
      }
    }
  };

  elements.forEach(traverse);
  return results;
}

/**
 * Find a single element by its ID in the content tree
 * @param content - ContentPage or array of ContentElements
 * @param elementId - Element ID to search for
 * @returns The matching element or undefined if not found
 *
 * @example
 * ```ts
 * const element = findElementById(content, "abc123");
 * if (element) {
 *   console.log(element.component, element.properties);
 * }
 * ```
 *
 * @public
 * @category Content
 */
export function findElementById(
  content: Schemas["ContentPage"] | Schemas["ContentElement"][],
  elementId: string,
): Schemas["ContentElement"] | undefined {
  const elements = Array.isArray(content) ? content : content.elements;

  const traverse = (
    element: Schemas["ContentElement"],
  ): Schemas["ContentElement"] | undefined => {
    // Check if this element matches
    if (element.id === elementId) {
      return element;
    }

    // Traverse child elements in slots
    if (element.slots && !Array.isArray(element.slots)) {
      for (const slotContent of Object.values(element.slots)) {
        for (const childElement of slotContent.elements) {
          const found = traverse(childElement);
          if (found) return found;
        }
      }
    }

    return undefined;
  };

  for (const element of elements) {
    const found = traverse(element);
    if (found) return found;
  }

  return undefined;
}

/**
 * Get elements from a specific named slot
 * @param element - ContentElement containing slots
 * @param slotName - Name of the slot to extract
 * @returns Array of elements in the slot, or empty array if slot doesn't exist
 *
 * @example
 * ```ts
 * const headerElements = getSlotElements(gridElement, "header");
 * const contentElements = getSlotElements(gridElement, "content");
 * ```
 *
 * @public
 * @category Content
 */
export function getSlotElements(
  element: Schemas["ContentElement"],
  slotName: string,
): Schemas["ContentElement"][] {
  if (!element.slots || Array.isArray(element.slots)) {
    return [];
  }

  const slot = element.slots[slotName];
  return slot ? slot.elements : [];
}

/**
 * Get all slot names from an element
 * @param element - ContentElement to inspect
 * @returns Array of slot names
 *
 * @example
 * ```ts
 * const slotNames = getSlotNames(element);
 * // => ["header", "content", "footer"]
 * ```
 *
 * @public
 * @category Content
 */
export function getSlotNames(element: Schemas["ContentElement"]): string[] {
  if (!element.slots || Array.isArray(element.slots)) {
    return [];
  }

  return Object.keys(element.slots);
}

/**
 * Get a property value from an element's properties
 * @param element - ContentElement to read from
 * @param propertyKey - Property key to retrieve
 * @param defaultValue - Default value if property doesn't exist
 * @returns The property value or default value
 *
 * @example
 * ```ts
 * const title = getElementProperty<string>(element, "title", "");
 * const isVisible = getElementProperty<boolean>(element, "visible", true);
 * ```
 *
 * @public
 * @category Content
 */
export function getElementProperty<T = unknown>(
  element: Schemas["ContentElement"],
  propertyKey: string,
  defaultValue?: T,
): T | undefined {
  if (!element.properties) {
    return defaultValue;
  }

  const value = element.properties[propertyKey];
  return value !== undefined ? (value as T) : defaultValue;
}

/**
 * Check if an element has a specific slot
 * @param element - ContentElement to check
 * @param slotName - Slot name to look for
 * @returns True if the slot exists and has elements
 *
 * @example
 * ```ts
 * if (hasSlot(element, "sidebar")) {
 *   const sidebarElements = getSlotElements(element, "sidebar");
 * }
 * ```
 *
 * @public
 * @category Content
 */
export function hasSlot(
  element: Schemas["ContentElement"],
  slotName: string,
): boolean {
  if (!element.slots || Array.isArray(element.slots)) {
    return false;
  }

  const slot = element.slots[slotName];
  return Boolean(slot && slot.elements.length > 0);
}

/**
 * Flatten the element tree into a single-level array
 * @param content - ContentPage or array of ContentElements
 * @returns Flat array of all elements in the tree
 *
 * @example
 * ```ts
 * const allElements = flattenElements(content);
 * console.log(`Total elements: ${allElements.length}`);
 * ```
 *
 * @public
 * @category Content
 */
export function flattenElements(
  content: Schemas["ContentPage"] | Schemas["ContentElement"][],
): Schemas["ContentElement"][] {
  const elements = Array.isArray(content) ? content : content.elements;
  const results: Schemas["ContentElement"][] = [];

  const traverse = (element: Schemas["ContentElement"]) => {
    results.push(element);

    // Traverse child elements in slots
    if (element.slots && !Array.isArray(element.slots)) {
      for (const slotContent of Object.values(element.slots)) {
        slotContent.elements.forEach(traverse);
      }
    }
  };

  elements.forEach(traverse);
  return results;
}

/**
 * Parse component type into namespace and component name
 * @param componentType - Component type string (e.g., "Sw:Content:Text")
 * @returns Object with namespace parts and component name
 *
 * @example
 * ```ts
 * parseComponentType("Sw:Content:Text");
 * // => { namespace: "Sw", category: "Content", name: "Text", full: "Sw:Content:Text" }
 *
 * parseComponentType("Sw:Grid");
 * // => { namespace: "Sw", category: null, name: "Grid", full: "Sw:Grid" }
 * ```
 *
 * @public
 * @category Content
 */
export function parseComponentType(componentType: string): {
  namespace: string;
  category: string | null;
  name: string;
  full: string;
} {
  const parts = componentType.split(":");

  if (parts.length === 3) {
    return {
      namespace: parts[0] || "",
      category: parts[1] || null,
      name: parts[2] || "",
      full: componentType,
    };
  }

  if (parts.length === 2) {
    return {
      namespace: parts[0] || "",
      category: null,
      name: parts[1] || "",
      full: componentType,
    };
  }

  return {
    namespace: "",
    category: null,
    name: componentType,
    full: componentType,
  };
}
