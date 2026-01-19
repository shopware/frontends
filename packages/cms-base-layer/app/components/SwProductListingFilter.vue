<script setup lang="ts" generic="ListingFilter extends { code: string }">
import { computed } from "vue";
import type { Component } from "vue";
import SwFilterPriceVue from "./listing-filters/SwFilterPrice.vue";
import SwFilterPropertiesVue from "./listing-filters/SwFilterProperties.vue";
import SwFilterRatingVue from "./listing-filters/SwFilterRating.vue";
import SwFilterShippingFreeVue from "./listing-filters/SwFilterShippingFree.vue";

const {
  filter,
  selectedManufacturer,
  selectedProperties,
  selectedMinPrice,
  selectedMaxPrice,
  selectedRating,
  selectedShippingFree,
  displayMode = "accordion",
} = defineProps<{
  filter: ListingFilter;
  selectedManufacturer: Set<string>;
  selectedProperties: Set<string>;
  selectedMinPrice: number | undefined;
  selectedMaxPrice: number | undefined;
  selectedRating: number | undefined;
  selectedShippingFree: boolean | undefined;
  displayMode?: "accordion" | "dropdown";
}>();

const emit = defineEmits<{
  "filter-change": [{ code: string; value: string | number | boolean }];
}>();

const transformedFilters = computed(() => ({
  price: {
    min: selectedMinPrice,
    max: selectedMaxPrice,
  },
  rating: selectedRating,
  "shipping-free": selectedShippingFree,
  manufacturer: [...selectedManufacturer],
  properties: [...selectedProperties],
}));

const filterComponent = computed<Component | undefined>(() => {
  const componentMap: Record<string, Component> = {
    manufacturer: SwFilterPropertiesVue,
    price: SwFilterPriceVue,
    rating: SwFilterRatingVue,
    "shipping-free": SwFilterShippingFreeVue,
  };

  return (
    componentMap[filter.code] ||
    ("options" in filter ? SwFilterPropertiesVue : undefined)
  );
});

const handleSelectValue = ({
  code,
  value,
}: { code: string; value: string | number | boolean }) => {
  emit("filter-change", { code, value });
};
</script>
<template>
  <div>
    <component
      :is="filterComponent"
      :filter="filter"
      :selected-filters="transformedFilters"
      :display-mode="displayMode"
      @select-value="handleSelectValue"
    />
  </div>
</template>
