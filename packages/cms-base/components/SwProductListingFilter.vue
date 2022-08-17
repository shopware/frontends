<script setup lang="ts">
import { ListingFilter } from "@shopware-pwa/types";
import SwFilterPropertiesVue from "./listing-filters/SwFilterProperties.vue";
import SwFilterPriceVue from "./listing-filters/SwFilterPrice.vue";
import SwFilterRatingVue from "./listing-filters/SwFilterRating.vue";
import SwFilterShippingFreeVue from "./listing-filters/SwFilterShippingFree.vue";

const emit = defineEmits<{
  (e: "selectFilterValue", { code, value }: { code: any; value: any }): void;
}>();

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters: {
    [key: string]: any;
  };
}>();

const cmsMap = () => {
  const map: {
    [key: string]: any;
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
    <ClientOnly>
      <component
        :is="cmsMap()"
        :filter="filter"
        :selectedFilters="selectedFilters"
        @select-value="emit('selectFilterValue', $event)"
      />
    </ClientOnly>
  </div>
</template>
