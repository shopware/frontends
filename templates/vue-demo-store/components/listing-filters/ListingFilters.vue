<script setup lang="ts">
import type { RequestParameters } from "#shopware";
import ListingFilter from "./ListingFilter.vue";
import { computed, provide, reactive } from "vue";
import type { ComputedRef, UnwrapNestedRefs } from "vue";

const {
  filtersToQuery,
  getCurrentFilters,
  getCurrentSortingOrder,
  getInitialFilters,
  search,
} = useListing({
  listingType: "productSearchListing",
});

const route = useRoute();
const router = useRouter();

// @ToDo: clean up the "any" inside searchSelectedFilters
/* eslint-disable */
const searchSelectedFilters: UnwrapNestedRefs<{
  [key: string]: any;
}> = reactive<{
  manufacturer: Set<any>;
  properties: Set<any>;
  "min-price": string | number | undefined;
  "max-price": string | number | undefined;
  rating: string | number | undefined;
  "shipping-free": boolean | undefined;
}>({
  manufacturer: new Set(),
  properties: new Set(),
  "min-price": undefined,
  "max-price": undefined,
  rating: undefined,
  "shipping-free": undefined,
});
/* eslint-enable */

const searchCriteriaForRequest: ComputedRef<RequestParameters<"searchPage">> =
  computed(() => ({
    // turn Set to array and then into string with | separator
    manufacturer: [...searchSelectedFilters.manufacturer]?.join("|"),
    // turn Set to array and then into string with | separator
    properties: [...searchSelectedFilters.properties]?.join("|"),
    "min-price": searchSelectedFilters["min-price"],
    "max-price": searchSelectedFilters["max-price"],
    order: getCurrentSortingOrder.value,
    "shipping-free": searchSelectedFilters["shipping-free"],
    rating: searchSelectedFilters["rating"],
    search: "",
  }));

for (const param in route.query) {
  if (searchSelectedFilters.hasOwnProperty(param)) {
    if (
      searchSelectedFilters[param] &&
      typeof searchSelectedFilters[param] === "object"
    ) {
      (route.query[param] as unknown as string)
        .split("|")
        .forEach((element) => {
          searchSelectedFilters[param].add(element);
        });
    } else {
      searchSelectedFilters[param] = route.query[param];
    }
  }
}

const onOptionSelectToggle = async ({
  code,
  value,
}: {
  code: string;
  value: string;
}) => {
  if (!["properties", "manufacturer"].includes(code)) {
    searchSelectedFilters[code] = value;
  } else {
    if (searchSelectedFilters[code]?.has(value)) {
      searchSelectedFilters[code]?.delete(value);
    } else {
      searchSelectedFilters[code]?.add(value);
    }
  }

  await search({
    ...searchCriteriaForRequest.value,
    ...route.query,
  });
  await router.push({
    query: {
      search: route.query.search,
      ...filtersToQuery(searchCriteriaForRequest.value),
    },
  });
};

const clearFilters = async () => {
  searchSelectedFilters.manufacturer.clear();
  searchSelectedFilters.properties.clear();
  searchSelectedFilters["min-price"] = undefined;
  searchSelectedFilters["max-price"] = undefined;
  searchSelectedFilters["rating"] = undefined;
  searchSelectedFilters["shipping-free"] = undefined;
  search({
    ...route.query,
    ...filtersToQuery(searchCriteriaForRequest.value),
  } as RequestParameters<"searchPage">);

  await router.push({
    query: {
      search: route.query.search,
      ...filtersToQuery(searchCriteriaForRequest.value),
    },
  });
};

async function invokeCleanFilters() {
  await search({
    ...route.query,
  } as unknown as RequestParameters<"searchPage">);
  clearFilters();
}

const selectedOptionIds = computed(() => [
  ...searchSelectedFilters.properties,
  ...searchSelectedFilters.manufacturer,
]);
const showResetFiltersButton = computed<boolean>(() => {
  if (
    selectedOptionIds.value.length !== 0 ||
    searchSelectedFilters["max-price"] ||
    searchSelectedFilters["min-price"] ||
    searchSelectedFilters["rating"] ||
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
