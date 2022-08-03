<script setup lang="ts">
import { pascalCase } from "scule";
import { ListingFilter } from "@shopware-pwa/types";
defineEmits<{
  selectFilterValue: ({ code, value }: { code: any; value: any }) => void;
}>();

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters: {
    [key: string]: any;
  };
}>();

const filterAlias: { [code: string]: string } = {
  // filter.code
  manufacturer: "properties",
};

const filterPathToResolve = `./listing-filters/SwFilter${pascalCase(
  filterAlias[props.filter.code] ?? props?.filter?.code
)}.vue`;
const FilterComponent = defineAsyncComponent(
  () => import(/* @vite-ignore */ filterPathToResolve)
);
</script>
<template>
  <ClientOnly>
    <component
      :is="FilterComponent"
      :filter="filter"
      :selectedFilters="selectedFilters"
      @select-value="$emit('selectFilterValue', $event)"
    />
  </ClientOnly>
</template>
