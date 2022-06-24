<script setup lang="ts">
import { pascalCase } from "scule";
defineEmits(["selectFilterValue"]);
const $props = defineProps({
  filter: Object,
  selectedFilters: Object,
});
const filterAlias = {
  // filter.code
  manufacturer: "properties",
};

const filterPathToResolve = `./listing-filters/SwFilter${pascalCase(
  filterAlias[$props.filter.code] ?? $props?.filter?.code
)}.vue`;
const FilterComponent = defineAsyncComponent(
  () => import(/* @vite-ignore */ filterPathToResolve)
);
</script>
<template>
  <component
    :is="FilterComponent"
    :filter="filter"
    :selectedFilters="selectedFilters"
    @select-value="$emit('selectFilterValue', $event)"
  />
</template>
