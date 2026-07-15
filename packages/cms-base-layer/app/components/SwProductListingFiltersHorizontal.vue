<script setup lang="ts">
import type {
  CmsElementProductListing,
  CmsElementSidebarFilter,
} from "@shopware/composables";
import { useCmsTranslations } from "@shopware/composables";
import { getCategoryFilterPostFilter } from "@shopware/helpers";
import { defu } from "defu";
import { computed } from "vue";
import type { ComputedRef } from "vue";
import type { LocationQueryRaw } from "vue-router";

import {
  firstQueryValue,
  toNumber,
  useCategoryListing,
  useProductSearchListing,
  useRoute,
  useRouter,
  useSelectedListingFilters,
} from "#imports";
import type { Schemas, operations } from "#shopware";

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

const route = useRoute();
const router = useRouter();

const {
  changeCurrentSortingOrder,
  getCurrentSortingOrder,
  getInitialFilters,
  getSortingOrders,
  search,
} = isProductSearch ? useProductSearchListing() : useCategoryListing();

const sidebarSelectedFilters = useSelectedListingFilters();

const showResetFiltersButton = computed<boolean>(() => {
  if (
    sidebarSelectedFilters.manufacturer.size !== 0 ||
    sidebarSelectedFilters.properties.size !== 0 ||
    (isProductSearch && sidebarSelectedFilters.categories.size !== 0) ||
    sidebarSelectedFilters["max-price"] ||
    sidebarSelectedFilters["min-price"] ||
    sidebarSelectedFilters.rating ||
    sidebarSelectedFilters["shipping-free"]
  ) {
    return true;
  }

  return false;
});

const searchCriteriaForRequest: ComputedRef<Schemas["ProductListingCriteria"]> =
  computed(() => ({
    manufacturer: [
      ...(sidebarSelectedFilters.manufacturer as Set<string>),
    ]?.join("|"),
    properties: [...(sidebarSelectedFilters.properties as Set<string>)]?.join(
      "|",
    ),
    // Category selection travels as a post-filter so the category
    // aggregation itself is not reduced (faceted behavior). Search pages
    // only: category pages never offer this filter, so a stale
    // ?categories= param must not silently narrow them.
    ...(isProductSearch && sidebarSelectedFilters.categories.size > 0
      ? {
          "post-filter": [
            getCategoryFilterPostFilter([
              ...(sidebarSelectedFilters.categories as Set<string>),
            ]),
          ],
        }
      : {}),
    "min-price": sidebarSelectedFilters["min-price"] as number,
    "max-price": sidebarSelectedFilters["max-price"] as number,
    order: getCurrentSortingOrder.value as string,
    "shipping-free": sidebarSelectedFilters["shipping-free"] as boolean,
    rating: sidebarSelectedFilters.rating as number,
    search: isProductSearch ? (firstQueryValue(route.query.search) ?? "") : "",
    limit: toNumber(firstQueryValue(route.query.limit)) ?? 15,
  }));

const handleFilterChange = async (event: {
  code: string;
  value: string | number | boolean;
}) => {
  try {
    const { code, value } = event;

    if (
      code === "manufacturer" ||
      code === "properties" ||
      code === "categories"
    ) {
      const filterSet = sidebarSelectedFilters[code];
      const stringValue = String(value);

      if (filterSet.has(stringValue)) {
        filterSet.delete(stringValue);
      } else {
        filterSet.add(stringValue);
      }
    } else if (code === "min-price" || code === "max-price") {
      sidebarSelectedFilters[code] =
        typeof value === "number" ? value : Number(value);
    } else if (code === "rating") {
      sidebarSelectedFilters.rating = Number(value);
    } else if (code === "shipping-free") {
      sidebarSelectedFilters["shipping-free"] = Boolean(value);
    }

    await executeSearch();
  } catch (error) {
    console.error("Filter update failed:", error);
  }
};

const executeSearch = async () => {
  try {
    // Search context refetches from the URL (the page's useAsyncData watches
    // route.query), so navigating below is enough; calling search() here too
    // would double-fetch and flicker. Category listings have no URL watcher.
    if (!isProductSearch) {
      await search(searchCriteriaForRequest.value);
    }

    // Build query directly from searchCriteriaForRequest which already has pipe-separated strings
    const criteria = searchCriteriaForRequest.value;
    const query: Record<string, unknown> = {};

    if (criteria.manufacturer) query.manufacturer = criteria.manufacturer;
    if (criteria.properties) query.properties = criteria.properties;
    if (isProductSearch && sidebarSelectedFilters.categories.size > 0)
      query.categories = [
        ...(sidebarSelectedFilters.categories as Set<string>),
      ].join("|");
    if (criteria["min-price"]) query["min-price"] = criteria["min-price"];
    if (criteria["max-price"]) query["max-price"] = criteria["max-price"];
    if (criteria.rating) query.rating = criteria.rating;
    if (criteria["shipping-free"])
      query["shipping-free"] = criteria["shipping-free"];
    if (criteria.order) query.order = criteria.order;
    // Keep the search term in the URL so filtering on the search page does not reset the query
    if (isProductSearch && route.query.search)
      query.search = route.query.search;
    // Preserve the page-size selection; rebuilding the query from scratch would
    // otherwise drop `limit` and revert to the default on refresh/navigation.
    if (route.query.limit) query.limit = route.query.limit;

    await router.push({
      query: query as LocationQueryRaw,
    });
  } catch (error) {
    console.error("Search execution failed:", error);
  }
};

const clearFilters = () => {
  (sidebarSelectedFilters.manufacturer as Set<string>).clear();
  (sidebarSelectedFilters.properties as Set<string>).clear();
  (sidebarSelectedFilters.categories as Set<string>).clear();
  sidebarSelectedFilters["min-price"] = undefined;
  sidebarSelectedFilters["max-price"] = undefined;
  sidebarSelectedFilters.rating = undefined;
  sidebarSelectedFilters["shipping-free"] = undefined;
};

const currentSortingOrder = computed({
  get: (): string => getCurrentSortingOrder.value || "",
  set: async (order: string): Promise<void> => {
    try {
      await router.push({
        query: {
          ...route.query,
          order,
        },
      });

      // Search context refetches from the URL; category fetches directly.
      if (!isProductSearch) {
        await changeCurrentSortingOrder(order, {
          ...(route.query as unknown as operations["searchPage post /search"]["body"]),
          limit: toNumber(firstQueryValue(route.query.limit)) ?? 15,
        });
      }
    } catch (error) {
      console.error("Sorting order change failed:", error);
    }
  },
});

async function invokeCleanFilters() {
  try {
    clearFilters();
    await executeSearch();
  } catch (error) {
    console.error("Clear filters failed:", error);
  }
}

const handleSortChange = (sortKey: string) => {
  currentSortingOrder.value = sortKey;
};

// Helper to check if a filter has active selections
const hasActiveFilter = (filter: { code: string }) => {
  if (filter.code === "manufacturer") {
    return sidebarSelectedFilters.manufacturer.size > 0;
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
    return sidebarSelectedFilters["shipping-free"] === true;
  }
  // Properties filter - check if any property from this filter group is selected
  return sidebarSelectedFilters.properties.size > 0;
};
</script>

<template>
  <div>
    <!-- Horizontal Filters Row -->
    <div class="flex flex-wrap items-center justify-start gap-4 z-10">
      <!-- Filter dropdowns -->
      <SwFilterDropdown
        v-for="filter in getInitialFilters"
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
