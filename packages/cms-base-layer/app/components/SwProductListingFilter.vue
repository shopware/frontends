<script setup lang="ts" generic="ListingFilter extends { code: string }">
import { computed } from "vue";
import type { Component } from "vue";
import SwFilterPriceVue from "./listing-filters/SwFilterPrice.vue";
import SwFilterPropertiesVue from "./listing-filters/SwFilterProperties.vue";
import SwFilterRatingVue from "./listing-filters/SwFilterRating.vue";
import SwFilterShippingFreeVue from "./listing-filters/SwFilterShippingFree.vue";

const props = defineProps<{
  filter: ListingFilter;
  selectedManufacturer: Set<string>;
  selectedProperties: Set<string>;
  selectedMinPrice: number | undefined;
  selectedMaxPrice: number | undefined;
  selectedRating: number | undefined;
  selectedShippingFree: boolean | undefined;
}>();

const emit = defineEmits<{
  "filter-change": [{ code: string; value: string | number | boolean }];
}>();

const transformedFilters = computed(() => ({
  price: {
    min: props.selectedMinPrice,
    max: props.selectedMaxPrice,
  },
  rating: props.selectedRating,
  "shipping-free": props.selectedShippingFree,
  manufacturer: [...props.selectedManufacturer],
  properties: [...props.selectedProperties],
}));

const filterComponent = computed<Component | undefined>(() => {
  const componentMap: Record<string, Component> = {
    manufacturer: SwFilterPropertiesVue,
    price: SwFilterPriceVue,
    rating: SwFilterRatingVue,
    "shipping-free": SwFilterShippingFreeVue,
  };

  return (
    componentMap[props.filter.code] ||
    ("options" in props.filter ? SwFilterPropertiesVue : undefined)
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
      @select-value="handleSelectValue"
    />
  </div>
</template>
