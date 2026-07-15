<script setup lang="ts" generic="ListingFilter extends { code: string }">
import { computed } from "vue";

import type { Schemas } from "#shopware";

import ListingFiltersPrice from "./ListingFiltersPrice.vue";
import ListingFiltersProperties from "./ListingFiltersProperties.vue";
import ListingFiltersRating from "./ListingFiltersRating.vue";
import ListingFiltersShippingFree from "./ListingFiltersShippingFree.vue";

const emit =
  defineEmits<
    (
      e: "selectFilterValue",
      { code, value }: { code: string; value: string },
    ) => void
  >();

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters?: Schemas["ProductListingResult"]["currentFilters"];
}>();

const cmsMap = () => {
  const map: {
    [key: string]: object;
  } = {
    manufacturer: ListingFiltersProperties,
    properties: ListingFiltersProperties,
    categories: ListingFiltersProperties,
    price: ListingFiltersPrice,
    rating: ListingFiltersRating,
    "shipping-free": ListingFiltersShippingFree,
  };

  return map[props.filter?.code];
};

const { sessionContext } = useSessionContext();

// The sales channel entry point is an ancestor of every product's category
// tree, so it would always show up with the full result count - hide it.
const preparedFilter = computed(() => {
  if (props.filter.code !== "categories") {
    return props.filter;
  }
  const rootCategoryId =
    sessionContext.value?.salesChannel?.navigationCategoryId;
  const entities = (
    (props.filter as { entities?: Array<{ id: string }> }).entities ?? []
  ).filter((entity) => entity.id !== rootCategoryId);
  return { ...props.filter, entities };
});
</script>
<template>
  <div>
    <component
      :is="cmsMap()"
      :filter="preparedFilter"
      :selected-filters="selectedFilters"
      @select-value="emit('selectFilterValue', $event)"
    />
  </div>
</template>
