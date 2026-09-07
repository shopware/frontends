<script setup lang="ts">
import type {
  CmsElementProductListing,
  CmsElementSidebarFilter,
} from "@shopware/composables";
import { useCmsTranslations } from "@shopware/composables";
import { defu } from "defu";

import { useListingFilters } from "#imports";

const props = defineProps<{
  content: CmsElementProductListing | CmsElementSidebarFilter;
  listingType?: string;
}>();

const isProductSearch = props.listingType === "productSearchListing";

type Translations = {
  listing: {
    filters: string;
    sort: string;
    resetFilters: string;
  };
};

let translations: Translations = {
  listing: {
    filters: "Filters",
    sort: "Sort",
    resetFilters: "Reset filters",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const {
  currentSortingOrder,
  getCurrentSortingOrder,
  getSortingOrders,
  handleFilterChange,
  handleRemoveFilterChip,
  handleSortChange,
  invokeCleanFilters,
  selectedFilters: sidebarSelectedFilters,
  showResetFiltersButton,
  visibleFilters,
} = useListingFilters(isProductSearch);

// Whether a filter has an active selection, for the collapsed chip state.
const hasActiveFilter = (filter: { code: string }) => {
  if (filter.code === "manufacturer") {
    return sidebarSelectedFilters.manufacturer.size > 0;
  }
  if (filter.code === "properties") {
    return sidebarSelectedFilters.properties.size > 0;
  }
  if (filter.code === "categories") {
    return sidebarSelectedFilters.categories.size > 0;
  }
  if (filter.code === "price") {
    return (
      sidebarSelectedFilters["min-price"] !== undefined ||
      sidebarSelectedFilters["max-price"] !== undefined
    );
  }
  if (filter.code === "rating") {
    return sidebarSelectedFilters.rating !== undefined;
  }
  if (filter.code === "shipping-free") {
    return sidebarSelectedFilters["shipping-free"] !== undefined;
  }
  return false;
};
</script>

<template>
  <div>
    <!-- Horizontal Filters Row -->
    <div class="flex flex-wrap items-center justify-start gap-4 z-10">
      <!-- Filter dropdowns -->
      <SwFilterDropdown
        v-for="filter in visibleFilters"
        :key="filter.id"
        :label="filter.label"
        :is-active="hasActiveFilter(filter)"
      >
        <SwProductListingFilter
          :filter="filter"
          display-mode="dropdown"
          :selected-manufacturer="sidebarSelectedFilters.manufacturer"
          :selected-properties="sidebarSelectedFilters.properties"
          :selected-categories="sidebarSelectedFilters.categories"
          :selected-min-price="sidebarSelectedFilters['min-price']"
          :selected-max-price="sidebarSelectedFilters['max-price']"
          :selected-rating="sidebarSelectedFilters.rating"
          :selected-shipping-free="sidebarSelectedFilters['shipping-free']"
          @filter-change="handleFilterChange"
        />
      </SwFilterDropdown>

      <!-- Sort dropdown -->
      <SwSortDropdown
        :sort-options="getSortingOrders ?? []"
        :current-sort="getCurrentSortingOrder ?? ''"
        :label="translations.listing.sort"
        @sort-change="handleSortChange"
      />

      <!-- Reset filters button -->
      <SwBaseButton
        v-if="showResetFiltersButton"
        variant="ghost"
        size="medium"
        @click="invokeCleanFilters"
        type="button"
      >
        {{ translations.listing.resetFilters }}
        <span
          class="w-5 h-5 i-carbon-close inline-block align-middle ml-1"
        ></span>
      </SwBaseButton>
    </div>
  </div>
</template>
