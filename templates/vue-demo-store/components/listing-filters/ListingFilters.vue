<script setup lang="ts">
import { ListingFilterCode } from "@shopware-pwa/types";

const { getAvailableFilters, setCurrentFilters, resetFilters } = useListing({
  listingType: "productSearchListing",
});

const mapComponent = (code: ListingFilterCode): string => {
  const components: { [key: string]: string } = {
    manufacturer: "ListingFiltersManufacturer",
    properties: "ListingFiltersProperties",
    price: "ListingFiltersPrice",
    rating: "ListingFiltersRating",
    "shipping-free": "ListingFiltersShippingFree",
  };

  return components[code];
};

const dirty = ref(false);

const updateFilter = (filter: {
  code: string;
  value: string | boolean | number;
}) => {
  setCurrentFilters({ [filter.code]: filter.value });
  dirty.value = true;
};

const handleReset = () => {
  dirty.value = false;
  resetFilters();
};
</script>

<template>
  <div class="flex flex-wrap gap-5">
    <component
      :is="mapComponent(filter.code)"
      v-for="filter in getAvailableFilters"
      :key="filter.code"
      :filter="filter"
      @select-value="updateFilter"
    />

    <button
      v-show="dirty"
      class="justify-center py-2 px-6 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      type="button"
      @click="handleReset"
    >
      {{ $t("listing.resetFilters") }}
    </button>
  </div>
</template>
