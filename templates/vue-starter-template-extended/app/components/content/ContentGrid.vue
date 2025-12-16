<script setup lang="ts">
import { computed } from "vue";
import { getSlotNames } from "~/composables/contentHelpers";
import { extractProperties } from "~/composables/useContentFactory";
import type { GridProperties } from "~/composables/useContentProperties";
import {
  GAP_CLASSES,
  GRID_COLUMN_CLASSES,
} from "~/composables/useContentStyles";
import type { Schemas } from "#shopware";

const props = defineProps<{
  element: Schemas["ContentElement"];
  properties: Record<string, unknown>;
}>();

// Type-safe property extraction
const { columns, gap, displayMode } = extractProperties<GridProperties>(
  props.properties,
  {
    columns: { default: 2 },
    gap: { default: "medium" },
    displayMode: { default: "standard" },
  },
);

// Use shared style configurations
const gapClass = computed(() => GAP_CLASSES[gap] || GAP_CLASSES.medium);

const columnsClass = computed(
  () => GRID_COLUMN_CLASSES[columns] || GRID_COLUMN_CLASSES[2],
);

const displayClass = computed(() => {
  return displayMode === "cover" ? "min-h-screen" : "";
});

const slotNames = computed(() => getSlotNames(props.element));
</script>

<template>
  <div
    class="content-grid grid w-full"
    :class="[columnsClass, gapClass, displayClass]"
  >
    <!-- Render named slots -->
    <div
      v-for="slotName in slotNames"
      :key="slotName"
      class="content-grid-item"
    >
      <slot :name="slotName" />
    </div>

    <!-- Default slot fallback -->
    <div v-if="slotNames.length === 0 && $slots.default">
      <slot />
    </div>
  </div>
</template>
