<script setup lang="ts">
import type { Schemas } from "#shopware";

/**
 * ContentGrid - Renders a grid layout with named slots
 */

// Component-specific props (add to schema later)
type GridProps = {
  columns?: number;
  gap?: "none" | "small" | "medium" | "large";
};

const props = defineProps<{
  element: Schemas["ContentElement"];
  htmlProps?: Schemas["ContentHtmlProps"];
  props?: GridProps;
}>();

const componentProps = (props.props ?? {}) as GridProps;

// Extract with defaults
const columns = componentProps.columns ?? 2;
const gap = componentProps.gap ?? "medium";

// Column classes
const columnClasses: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

// Gap classes
const gapClasses: Record<string, string> = {
  none: "gap-0",
  small: "gap-2",
  medium: "gap-4",
  large: "gap-8",
};
</script>

<template>
  <div
    class="content-grid grid"
    :class="[columnClasses[columns] || columnClasses[2], gapClasses[gap]]"
  >
    <!-- Render all slots -->
    <slot />
  </div>
</template>
