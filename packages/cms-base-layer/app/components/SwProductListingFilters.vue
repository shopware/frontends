<script setup lang="ts">
import type {
  CmsElementProductListing,
  CmsElementSidebarFilter,
} from "@shopware/composables";
import { useCmsTranslations } from "@shopware/composables";
import { defu } from "defu";

import { useListingFilters } from "#imports";

const props = defineProps<{
  content?: CmsElementProductListing | CmsElementSidebarFilter;
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
  getSortingOrders,
  handleFilterChange,
  handleRemoveFilterChip,
  handleSortChange,
  invokeCleanFilters,
  selectedFilters: sidebarSelectedFilters,
  showResetFiltersButton,
  visibleFilters,
} = useListingFilters(isProductSearch);
</script>
<template>
  <div>
    <!-- Active Filter Chips -->
    <SwFilterChips
      :filters="sidebarSelectedFilters"
      :available-filters="visibleFilters"
      @remove="handleRemoveFilterChip"
    />

    <!-- Filters Header -->
    <div class="self-stretch flex flex-col justify-start items-start gap-4">
      <div
        class="flex flex-row items-center justify-between w-full mb-4 py-3 border-b border-outline-outline-variant"
      >
        <div
          class="flex-1 text-surface-on-surface text-base font-bold leading-normal"
        >
          {{ translations.listing.filters }}
        </div>
        <SwSortDropdown
          :sort-options="getSortingOrders ?? []"
          :current-sort="getCurrentSortingOrder ?? ''"
          :label="translations.listing.sort"
          @sort-change="handleSortChange"
        />
      </div>
    </div>

    <!-- Filters List -->
    <div class="self-stretch flex flex-col justify-start items-start gap-4">
      <SwProductListingFilter
        v-for="filter in visibleFilters"
        :key="filter.id"
        :filter="filter"
        :selected-manufacturer="sidebarSelectedFilters.manufacturer"
        :selected-properties="sidebarSelectedFilters.properties"
        :selected-categories="sidebarSelectedFilters.categories"
        :selected-min-price="sidebarSelectedFilters['min-price']"
        :selected-max-price="sidebarSelectedFilters['max-price']"
        :selected-rating="sidebarSelectedFilters.rating"
        :selected-shipping-free="sidebarSelectedFilters['shipping-free']"
        @filter-change="handleFilterChange"
        class="w-full"
      />
      <div v-if="showResetFiltersButton" class="w-full">
        <SwBaseButton
          variant="primary"
          size="medium"
          block
          @click="invokeCleanFilters"
          type="button"
        >
          {{ translations.listing.resetFilters }}
          <span
            class="w-6 h-6 i-carbon-close-filled inline-block align-middle ml-2"
          ></span>
        </SwBaseButton>
      </div>
    </div>
  </div>
</template>
