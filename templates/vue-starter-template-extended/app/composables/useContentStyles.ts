/**
 * Common style configurations for content elements
 * This makes styling consistent and reusable across components
 */

/**
 * Generic class mapper
 */
export function useClassMapper<T extends string>(
  map: Record<T, string>,
  fallback: string,
) {
  return (value: T | string): string => {
    return map[value as T] || fallback;
  };
}

/**
 * Horizontal alignment classes
 */
export const ALIGNMENT_TEXT_CLASSES: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const ALIGNMENT_FLEX_CLASSES: Record<string, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export const ALIGNMENT_ITEMS_CLASSES: Record<string, string> = {
  top: "items-start",
  center: "items-center",
  bottom: "items-end",
};

/**
 * Vertical alignment classes
 */
export const VERTICAL_ALIGNMENT_CLASSES: Record<string, string> = {
  top: "justify-start",
  center: "justify-center",
  bottom: "justify-end",
};

/**
 * Gap/spacing classes
 */
export const GAP_CLASSES: Record<string, string> = {
  small: "gap-4",
  medium: "gap-6",
  large: "gap-8",
};

/**
 * Size classes for buttons and other interactive elements
 */
export const SIZE_CLASSES: Record<string, string> = {
  small: "px-3 py-1.5 text-sm",
  medium: "px-4 py-2 text-base",
  large: "px-6 py-3 text-lg",
};

/**
 * Button variant classes
 */
export const BUTTON_VARIANT_CLASSES: Record<string, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white border-transparent",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white border-transparent",
  outline: "bg-transparent hover:bg-gray-50 text-gray-900 border-gray-300",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-900 border-transparent",
};

/**
 * Image display mode classes
 */
export const IMAGE_DISPLAY_MODE_CLASSES: Record<string, string> = {
  standard: "object-cover",
  cover: "object-cover",
  contain: "object-contain",
  auto: "object-scale-down",
};

/**
 * Grid column classes
 */
export const GRID_COLUMN_CLASSES: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 md:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
};

/**
 * Composable for alignment classes
 */
export function useAlignmentClasses(
  alignment = "left",
  type: "text" | "flex" | "items" = "text",
) {
  const maps = {
    text: ALIGNMENT_TEXT_CLASSES,
    flex: ALIGNMENT_FLEX_CLASSES,
    items: ALIGNMENT_ITEMS_CLASSES,
  };

  return maps[type][alignment] || maps[type].left;
}

/**
 * Composable for vertical alignment classes
 */
export function useVerticalAlignmentClasses(alignment = "top") {
  return (
    VERTICAL_ALIGNMENT_CLASSES[alignment] || VERTICAL_ALIGNMENT_CLASSES.top
  );
}

/**
 * Composable for size classes
 */
export function useSizeClasses(size = "medium") {
  return SIZE_CLASSES[size] || SIZE_CLASSES.medium;
}

/**
 * Composable for gap classes
 */
export function useGapClasses(gap = "medium") {
  return GAP_CLASSES[gap] || GAP_CLASSES.medium;
}
