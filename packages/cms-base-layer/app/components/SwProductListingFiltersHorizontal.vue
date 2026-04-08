<script setup lang="ts">
import type {
  CmsElementProductListing,
  CmsElementSidebarFilter,
} from "@shopware/composables";
import { useCmsTranslations } from "@shopware/composables";
import { defu } from "defu";
import { computed, reactive } from "vue";
import type { ComputedRef, UnwrapNestedRefs } from "vue";
import { type LocationQueryRaw, useRoute, useRouter } from "vue-router";
import { useCategoryListing } from "#imports";
import type { Schemas, operations } from "#shopware";

const props = defineProps<{
  content: CmsElementProductListing | CmsElementSidebarFilter;
  listingType?: string;
}>();

type Translations = {
  listing: {
    filters: string;
    sort: string;
    resetFilters: string;
  };
};

type FilterState = {
  manufacturer: Set<string>;
  properties: Set<string>;
  "min-price": number | undefined;
  "max-price": number | undefined;
  rating: number | undefined;
  "shipping-free": boolean | undefined;
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
} = useCategoryListing();

const sidebarSelectedFilters: UnwrapNestedRefs<FilterState> =
  reactive<FilterState>({
    manufacturer: new Set(),
    properties: new Set(),
    "min-price": undefined,
    "max-price": undefined,
    rating: undefined,
    "shipping-free": undefined,
  });

const showResetFiltersButton = computed<boolean>(() => {
  if (
    sidebarSelectedFilters.manufacturer.size !== 0 ||
    sidebarSelectedFilters.properties.size !== 0 ||
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
    "min-price": sidebarSelectedFilters["min-price"] as number,
    "max-price": sidebarSelectedFilters["max-price"] as number,
    order: getCurrentSortingOrder.value as string,
    "shipping-free": sidebarSelectedFilters["shipping-free"] as boolean,
    rating: sidebarSelectedFilters.rating as number,
    search: "",
    limit: route.query.limit ? Number(route.query.limit) : 15,
  }));

for (const param in route.query) {
  if (param in sidebarSelectedFilters) {
    const queryValue = route.query[param];

    // Skip arrays
    if (Array.isArray(queryValue)) continue;

    if (["manufacturer", "properties"].includes(param)) {
      if (typeof queryValue === "string") {
        const elements = queryValue.split("|");
        const targetSet = sidebarSelectedFilters[
          param as keyof FilterState
        ] as Set<string>;
        for (const element of elements) {
          targetSet.add(element);
        }
      }
    } else if (queryValue && typeof queryValue === "string") {
      // Fix: Use specific property assignments instead of generic keyof
      if (param === "min-price") {
        const numValue = Number(queryValue);
        if (!Number.isNaN(numValue)) {
          sidebarSelectedFilters["min-price"] = numValue;
        }
      } else if (param === "max-price") {
        const numValue = Number(queryValue);
        if (!Number.isNaN(numValue)) {
          sidebarSelectedFilters["max-price"] = numValue;
        }
      } else if (param === "rating") {
        const numValue = Number(queryValue);
        if (!Number.isNaN(numValue)) {
          sidebarSelectedFilters.rating = numValue;
        }
      } else if (param === "shipping-free") {
        sidebarSelectedFilters["shipping-free"] = queryValue === "true";
      }
    }
  }
}

const handleFilterChange = async (event: {
  code: string;
  value: string | number | boolean;
}) => {
  try {
    const { code, value } = event;

    if (code === "manufacturer" || code === "properties") {
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
    await search(searchCriteriaForRequest.value);

    // Build query directly from searchCriteriaForRequest which already has pipe-separated strings
    const criteria = searchCriteriaForRequest.value;
    const query: Record<string, unknown> = {};

    if (criteria.manufacturer) query.manufacturer = criteria.manufacturer;
    if (criteria.properties) query.properties = criteria.properties;
    if (criteria["min-price"]) query["min-price"] = criteria["min-price"];
    if (criteria["max-price"]) query["max-price"] = criteria["max-price"];
    if (criteria.rating) query.rating = criteria.rating;
    if (criteria["shipping-free"])
      query["shipping-free"] = criteria["shipping-free"];
    if (criteria.order) query.order = criteria.order;

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

      await changeCurrentSortingOrder(order, {
        ...(route.query as unknown as operations["searchPage post /search"]["body"]),
        limit: route.query.limit ? Number(route.query.limit) : 15,
      });
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
        <span class="w-5 h-5 i-carbon-close inline-block align-middle ml-1"></span>
      </SwBaseButton>
    </div>
  </div>
</template>
