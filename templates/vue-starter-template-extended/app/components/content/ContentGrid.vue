<script setup lang="ts">
import { computed } from "vue";
import { getElementProperty, getSlotNames } from "~/composables/contentHelpers";
import type { Schemas } from "#shopware";

const props = defineProps<{
  element: Schemas["ContentElement"];
  properties: Record<string, unknown>;
}>();

const columns = computed(() =>
  getElementProperty<number>(props.element, "columns", 2),
);
const gap = computed(() =>
  getElementProperty<"small" | "medium" | "large">(
    props.element,
    "gap",
    "medium",
  ),
);
const displayMode = computed(() =>
  getElementProperty<"standard" | "cover">(
    props.element,
    "displayMode",
    "standard",
  ),
);

const gapClass = computed(() => {
  const gapMap: Record<string, string> = {
    small: "gap-4",
    medium: "gap-6",
    large: "gap-8",
  };
  return gapMap[gap.value as string] || "gap-6";
});

const columnsClass = computed(() => {
  const colsMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  };
  return colsMap[columns.value as number] || colsMap[2];
});

const displayClass = computed(() => {
  return displayMode.value === "cover" ? "min-h-screen" : "";
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
