<script setup lang="ts" generic="ListingFilter extends { code: string }">
import { excludeRootCategory } from "@shopware/helpers";
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
const { t, te } = useI18n();

const preparedFilter = computed(() => {
  const filter = props.filter as {
    code: string;
    label?: string;
    entities?: Array<{ id: string }>;
  };

  // getListingFilters labels most filters with the raw aggregation name, so
  // translate the codes we know. Property groups carry their own translated
  // name and have no entry here, which leaves them untouched.
  const labelKey = `listing.filterLabels.${filter.code}`;
  const label = te(labelKey) ? t(labelKey) : filter.label;

  if (filter.code !== "categories") {
    return { ...props.filter, label };
  }

  const entities = excludeRootCategory(
    filter.entities,
    sessionContext.value?.salesChannel?.navigationCategoryId,
  )
    // Drop the count: on the search route it counts every variant, while the
    // sibling filters collapse variants via their parent_childs aggregation.
    // Showing an inflated number next to correct ones reads as a bug.
    .map((entity) => ({ ...entity, count: undefined }));

  return { ...props.filter, label, entities };
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
