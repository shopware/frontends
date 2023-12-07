<script setup lang="ts" generic="ListingFilter extends { code: string }">
import ListingFiltersPrice from "./ListingFiltersPrice.vue";
import ListingFiltersProperties from "./ListingFiltersProperties.vue";
import ListingFiltersRating from "./ListingFiltersRating.vue";
import ListingFiltersShippingFree from "./ListingFiltersShippingFree.vue";

const emit = defineEmits<{
  (
    e: "selectFilterValue",
    { code, value }: { code: string; value: string },
  ): void;
}>();

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters: {
    [key: string]: object;
  };
}>();

const cmsMap = () => {
  const map: {
    [key: string]: object;
  } = {
    manufacturer: ListingFiltersProperties,
    properties: ListingFiltersProperties,
    price: ListingFiltersPrice,
    rating: ListingFiltersRating,
    "shipping-free": ListingFiltersShippingFree,
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
