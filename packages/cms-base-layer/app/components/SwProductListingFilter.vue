<script setup lang="ts" generic="ListingFilter extends { code: string }, FilterState extends { manufacturer: Set<string>; properties: Set<string>; 'min-price': number | undefined; 'max-price': number | undefined; rating: number | undefined; 'shipping-free': boolean | undefined; }">
import { computed } from "vue";
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

const transformedFilters = computed(() => ({
  price: {
    min: props.modelValue["min-price"],
    max: props.modelValue["max-price"],
  },
  rating: props.modelValue.rating,
  "shipping-free": props.modelValue["shipping-free"],
  manufacturer: [...props.modelValue.manufacturer],
  properties: [...props.modelValue.properties],
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
  const updatedFilters = {
    ...props.modelValue,
    manufacturer: new Set(props.modelValue.manufacturer),
    properties: new Set(props.modelValue.properties),
  };

  if (code === "manufacturer" || code === "properties") {
    const filterSet = updatedFilters[code];
    const stringValue = String(value);

    filterSet.has(stringValue)
      ? filterSet.delete(stringValue)
      : filterSet.add(stringValue);
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
      :is="filterComponent"
      :filter="filter"
      :selected-filters="transformedFilters"
      @select-value="handleSelectValue"
    />
  </div>
</template>
