<script setup lang="ts" generic="ListingFilter extends { code: string }, FilterState extends { manufacturer: Set<string>; properties: Set<string>; 'min-price': number | undefined; 'max-price': number | undefined; rating: number | undefined; 'shipping-free': boolean | undefined; }">
import type { Component } from "vue";
import SwFilterPriceVue from "./listing-filters/SwFilterPrice.vue";
import SwFilterPropertiesVue from "./listing-filters/SwFilterProperties.vue";
import SwFilterRatingVue from "./listing-filters/SwFilterRating.vue";
import SwFilterShippingFreeVue from "./listing-filters/SwFilterShippingFree.vue";

const props = defineProps<{
  filter: ListingFilter;
  modelValue: FilterState;
}>();

const emit = defineEmits<{
  "update:modelValue": [FilterState];
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

const handleSelectValue = ({
  code,
  value,
}: { code: string; value: string | number | boolean }) => {
  const updatedFilters = { ...props.modelValue };

  if (code === "properties" || code === "manufacturer") {
    const filterSet = new Set(updatedFilters[code]);
    const stringValue = String(value);

    if (filterSet.has(stringValue)) {
      filterSet.delete(stringValue);
    } else {
      filterSet.add(stringValue);
    }

    updatedFilters[code] = filterSet;
  } else if (code === "min-price" || code === "max-price") {
    updatedFilters[code] = typeof value === "number" ? value : Number(value);
  } else if (code === "rating") {
    updatedFilters.rating = Number(value);
  } else if (code === "shipping-free") {
    updatedFilters["shipping-free"] = Boolean(value);
  }

  emit("update:modelValue", updatedFilters as FilterState);
};
</script>
<template>
  <div>
    <component
      :is="cmsMap()"
      :filter="filter"
      :selected-filters="modelValue"
      @select-value="handleSelectValue"
    />
  </div>
</template>
