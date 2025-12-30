import type { Schemas } from "#shopware";

/**
 * Shared types for Content API components
 */

/**
 * Base props that every content component receives
 */
export type ContentComponentProps<T = unknown> = {
  element: Schemas["ContentElement"];
  htmlProps?: Schemas["ContentHtmlProps"];
  props?: T;
};

/**
 * Vue bindings for HTML attributes (ready to spread on element)
 */
export type HtmlBindings = {
  class?: string;
  id?: string;
  style?: Record<string, string>;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-hidden"?: boolean;
  "data-testid"?: string;
};

/**
 * Common alignment values used across components
 */
export type Alignment = "left" | "center" | "right";

/**
 * Alignment to Tailwind class mapping
 */
export const alignmentClasses: Record<Alignment, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/**
 * Common size values
 */
export type Size = "small" | "medium" | "large";

/**
 * Size to Tailwind padding classes
 */
export const sizeClasses: Record<Size, string> = {
  small: "px-3 py-1.5 text-sm",
  medium: "px-4 py-2 text-base",
  large: "px-6 py-3 text-lg",
};

/**
 * Gap size values for grid/flex layouts
 */
export type GapSize = "none" | "small" | "medium" | "large";

/**
 * Gap to Tailwind class mapping
 */
export const gapClasses: Record<GapSize, string> = {
  none: "gap-0",
  small: "gap-2",
  medium: "gap-4",
  large: "gap-8",
};

/**
 * Display mode for images
 */
export type DisplayMode = "standard" | "cover" | "contain";

/**
 * Display mode to Tailwind class mapping
 */
export const displayModeClasses: Record<DisplayMode, string> = {
  standard: "",
  cover: "object-cover",
  contain: "object-contain",
};
