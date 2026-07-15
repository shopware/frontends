<script setup lang="ts">
import { computed, provide, reactive, watch } from "vue";
import type { ComputedRef, UnwrapNestedRefs } from "vue";

import type { operations } from "#shopware";

import ListingFilter from "./ListingFilter.vue";

const {
  filtersToQuery,
  getCurrentFilters,
  getCurrentSortingOrder,
  getInitialFilters,
} = useProductSearchListing();

const route = useRoute();
const router = useRouter();

// @ToDo: clean up the "any" inside searchSelectedFilters
const searchSelectedFilters = reactive<{
  manufacturer: Set<string>;
  properties: Set<string>;
  categories: Set<string>;
  "min-price": string | number | undefined;
  "max-price": string | number | undefined;
  rating: string | number | undefined;
  "shipping-free": boolean | undefined;
  [key: string]: Set<string> | string | number | boolean | undefined;
}>({
  manufacturer: new Set<string>(),
  properties: new Set<string>(),
  categories: new Set<string>(),
  "min-price": undefined,
  "max-price": undefined,
  rating: undefined,
  "shipping-free": undefined,
});

const searchCriteriaForRequest: ComputedRef<
  operations["searchPage post /search"]["body"]
> = computed(() => ({
  manufacturer: [...searchSelectedFilters.manufacturer]?.join("|"),
  properties: [...searchSelectedFilters.properties]?.join("|"),
  "min-price": Number(searchSelectedFilters["min-price"]),
  "max-price": Number(searchSelectedFilters["max-price"]),
  order: getCurrentSortingOrder.value,
  "shipping-free": Boolean(searchSelectedFilters["shipping-free"]),
  rating: Number(searchSelectedFilters.rating),
  search: "",
}));

const syncFiltersFromQuery = () => {
  searchSelectedFilters.manufacturer.clear();
  searchSelectedFilters.properties.clear();
  searchSelectedFilters.categories.clear();
  searchSelectedFilters["min-price"] = undefined;
  searchSelectedFilters["max-price"] = undefined;
  searchSelectedFilters.rating = undefined;
  searchSelectedFilters["shipping-free"] = undefined;

  for (const param in route.query) {
    if (Object.prototype.hasOwnProperty.call(searchSelectedFilters, param)) {
      const target = searchSelectedFilters[param];
      if (target instanceof Set) {
        const elements = firstQueryValue(route.query[param])?.split("|") ?? [];
        for (const element of elements) {
          if (element) target.add(element);
        }
      } else {
        const queryValue = route.query[param];
        if (queryValue && !Array.isArray(queryValue)) {
          searchSelectedFilters[param] = queryValue;
        }
      }
    }
  }
};

syncFiltersFromQuery();
// Resync on Back/Forward so removed query params also clear the checkboxes.
watch(() => route.query, syncFiltersFromQuery);

const onOptionSelectToggle = async ({
  code,
  value,
}: {
  code: string;
  value: string;
}) => {
  if (!["properties", "manufacturer", "categories"].includes(code)) {
    searchSelectedFilters[code] = value;
  } else {
    const filterSet = searchSelectedFilters[code];
    if (filterSet instanceof Set) {
      if (filterSet.has(value)) {
        filterSet.delete(value);
      } else {
        filterSet.add(value);
      }
    }
  }
  // The search page's useAsyncData watches route.query and refetches with
  // the full criteria (filters, categories post-filter, aggregations); an
  // extra explicit search() here would race it with an incomplete body.
  await router.push({
    query: {
      search: route.query.search,
      ...filtersToQuery(searchCriteriaForRequest.value),
      ...(searchSelectedFilters.categories.size > 0
        ? { categories: [...searchSelectedFilters.categories].join("|") }
        : {}),
    },
  });
};

const clearFilters = async () => {
  searchSelectedFilters.manufacturer.clear();
  searchSelectedFilters.properties.clear();
  searchSelectedFilters.categories.clear();
  searchSelectedFilters["min-price"] = undefined;
  searchSelectedFilters["max-price"] = undefined;
  searchSelectedFilters.rating = undefined;
  searchSelectedFilters["shipping-free"] = undefined;
  await router.push({
    query: {
      search: route.query.search,
      ...filtersToQuery(searchCriteriaForRequest.value),
    },
  });
};

async function invokeCleanFilters() {
  await clearFilters();
}

const selectedOptionIds = computed(() => [
  ...searchSelectedFilters.properties,
  ...searchSelectedFilters.manufacturer,
  ...searchSelectedFilters.categories,
]);
const showResetFiltersButton = computed<boolean>(() => {
  if (
    selectedOptionIds.value.length !== 0 ||
    searchSelectedFilters["max-price"] ||
    searchSelectedFilters["min-price"] ||
    searchSelectedFilters.rating ||
    searchSelectedFilters["shipping-free"]
  ) {
    return true;
  }

  return false;
});
provide("selectedOptionIds", selectedOptionIds);
</script>

<template>
  <div class="flex flex-wrap gap-5">
    <div v-if="getInitialFilters.length" class="flex flex-wrap">
      <div
        v-for="filter in getInitialFilters"
        :key="`${filter?.id || filter?.code}`"
        class="mb-2 w-full"
      >
        <ListingFilter
          class="relative"
          :selected-filters="getCurrentFilters"
          :filter="filter"
          @select-filter-value="onOptionSelectToggle"
        />
      </div>
      <div v-if="showResetFiltersButton" class="mx-auto mt-4 mb-2">
        <button
          class="w-full justify-center py-2 px-6 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-black hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
          type="button"
          @click="invokeCleanFilters"
        >
          {{ $t("search.resetFilters") }}
          <span
            class="w-6 h-6 i-carbon-close-filled inline-block align-middle ml-2"
          ></span>
        </button>
      </div>
    </div>
  </div>
</template>
