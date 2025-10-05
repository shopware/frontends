<script setup lang="ts" generic="ListingFilter extends { code: string }">
import type { Component } from "vue";
import SwFilterPriceVue from "./listing-filters/SwFilterPrice.vue";
import SwFilterPropertiesVue from "./listing-filters/SwFilterProperties.vue";
import SwFilterRatingVue from "./listing-filters/SwFilterRating.vue";
import SwFilterShippingFreeVue from "./listing-filters/SwFilterShippingFree.vue";

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters?: {
    [key: string]: unknown;
  };
}>();

const emit = defineEmits<{
  selectFilterValue: [{ code: string; value: string | number | boolean }];
}>();

const cmsMap = () => {
  const map: {
    [key: string]: Component;
  } = {
    manufacturer: SwFilterPropertiesVue,
    properties: SwFilterPropertiesVue,
    price: SwFilterPriceVue,
    rating: SwFilterRatingVue,
    "shipping-free": SwFilterShippingFreeVue,
  };

  return map[props.filter?.code];
};
</script>
<template>
  <div>
    <component
      :is="cmsMap()"
      :filter="filter"
      :selected-filters="selectedFilters"
      @select-value="emit('selectFilterValue', $event)"
    />
  </div>
</template>
