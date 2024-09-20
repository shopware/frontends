<script setup lang="ts">
import { computed, provide, reactive, ref, useTemplateRef } from "vue";
import type { ComputedRef, UnwrapNestedRefs } from "vue";
import { defu } from "defu";
import SwProductListingFilter from "./SwProductListingFilter.vue";
import type {
  CmsElementProductListing,
  CmsElementSidebarFilter,
} from "@shopware-pwa/composables-next";
import { useCmsTranslations } from "@shopware-pwa/composables-next";
import { useCategoryListing } from "#imports";
import { onClickOutside } from "@vueuse/core";
import { type LocationQueryRaw, useRoute, useRouter } from "vue-router";
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

const isSortMenuOpen = ref(false);
const {
  changeCurrentSortingOrder,
  filtersToQuery,
  getCurrentFilters,
  getCurrentSortingOrder,
  getInitialFilters,
  getSortingOrders,
  search,
} = useCategoryListing();

const sidebarSelectedFilters: UnwrapNestedRefs<{
  [key: string]: any;
}> = reactive<{
  manufacturer: Set<string>;
  properties: Set<string>;
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

const showResetFiltersButton = computed<boolean>(() => {
  if (
    selectedOptionIds.value.length !== 0 ||
    sidebarSelectedFilters["max-price"] ||
    sidebarSelectedFilters["min-price"] ||
    sidebarSelectedFilters["rating"] ||
    sidebarSelectedFilters["shipping-free"]
  ) {
    return true;
  }

  return false;
});

const searchCriteriaForRequest: ComputedRef<Schemas["ProductListingCriteria"]> =
  computed(() => ({
    // turn Set to array and then into string with | separator
    manufacturer: [...(sidebarSelectedFilters.manufacturer as string[])]?.join(
      "|",
    ),
    // turn Set to array and then into string with | separator
    properties: [...(sidebarSelectedFilters.properties as string[])]?.join("|"),
    "min-price": sidebarSelectedFilters["min-price"] as number,
    "max-price": sidebarSelectedFilters["max-price"] as number,
    order: getCurrentSortingOrder.value as string,
    "shipping-free": sidebarSelectedFilters["shipping-free"] as boolean,
    rating: sidebarSelectedFilters["rating"] as number,
    search: "",
    limit: route.query.limit ? Number(route.query.limit) : 15,
  }));

for (const param in route.query) {
  if (sidebarSelectedFilters.hasOwnProperty(param)) {
    if (
      sidebarSelectedFilters[param] &&
      typeof sidebarSelectedFilters[param] === "object"
    ) {
      (route.query[param] as unknown as string)
        .split("|")
        .forEach((element) => {
          sidebarSelectedFilters[param].add(element);
        });
    } else {
      sidebarSelectedFilters[param] = route.query[param];
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
    sidebarSelectedFilters[code] = value;
  } else {
    if (sidebarSelectedFilters[code]?.has(value)) {
      sidebarSelectedFilters[code]?.delete(value);
    } else {
      sidebarSelectedFilters[code]?.add(value);
    }
  }

  await executeSearch();
};

const executeSearch = async () => {
  await search(searchCriteriaForRequest.value);
  const query = filtersToQuery(searchCriteriaForRequest.value);
  delete query.limit; // this will remove limit from the url query but still use it in the search
  await router.push({
    query: query as LocationQueryRaw,
  });
};

const clearFilters = () => {
  sidebarSelectedFilters.manufacturer.clear();
  sidebarSelectedFilters.properties.clear();
  sidebarSelectedFilters["min-price"] = undefined;
  sidebarSelectedFilters["max-price"] = undefined;
  sidebarSelectedFilters["rating"] = undefined;
  sidebarSelectedFilters["shipping-free"] = undefined;
};

const currentSortingOrder = computed({
  get: (): string => getCurrentSortingOrder.value || "",
  set: async (order: string): Promise<void> => {
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
  },
});

const selectedOptionIds = computed(() => [
  ...sidebarSelectedFilters.properties,
  ...sidebarSelectedFilters.manufacturer,
]);
provide("selectedOptionIds", selectedOptionIds);

async function invokeCleanFilters() {
  clearFilters();
  await executeSearch();
}
const isDefaultSidebarFilter =
  props.content.type === "sidebar-filter" &&
  props.content.config?.boxLayout?.value === "standard";
const dropdownElement = useTemplateRef("dropdownElement");
onClickOutside(dropdownElement, () => (isSortMenuOpen.value = false));
</script>
<template>
  <div class="bg-white">
    <div class="mx-auto m-0" :class="{ 'px-5': isDefaultSidebarFilter }">
      <ClientOnly>
        <div
          class="relative flex items-baseline justify-between pt-6 pb-6 border-b border-gray-200"
        >
          <div class="text-4xl tracking-tight text-gray-900">
            {{ translations.listing.filters }}
          </div>

          <div ref="dropdownElement" class="flex items-center">
            <div class="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  @click="isSortMenuOpen = !isSortMenuOpen"
                  class="group inline-flex justify-center bg-transparent text-base font-medium text-gray-700 hover:text-gray-900"
                  id="menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  {{ translations.listing.sort }}
                  <div
                    class="i-carbon-chevron-down h-5 w-5 ml-1"
                    :class="{ hidden: isSortMenuOpen }"
                  ></div>
                  <div
                    class="i-carbon-chevron-up h-5 w-5 ml-1"
                    :class="{ hidden: !isSortMenuOpen }"
                  ></div>
                </button>
              </div>
              <div
                :class="[isSortMenuOpen ? 'absolute' : 'hidden']"
                class="origin-top-left left-0 lg:origin-top-right lg:right-0 lg:left-auto mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-1000"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabindex="-1"
              >
                <div class="py-1" role="none">
                  <button
                    v-for="sorting in getSortingOrders"
                    :key="sorting.key"
                    @click="
                      currentSortingOrder = sorting.key;
                      isSortMenuOpen = false;
                    "
                    :class="[
                      sorting.key === getCurrentSortingOrder
                        ? 'font-medium text-gray-900'
                        : 'text-gray-500',
                    ]"
                    class="block px-4 py-2 text-sm bg-transparent"
                    role="menuitem"
                    tabindex="-1"
                  >
                    {{ sorting.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap" v-if="getInitialFilters.length">
          <div
            v-for="filter in getInitialFilters"
            :key="`${filter?.id || filter?.code}`"
            class="mb-2 w-full"
          >
            <SwProductListingFilter
              @select-filter-value="onOptionSelectToggle"
              :selected-filters="getCurrentFilters"
              :filter="filter"
              class="relative"
            />
          </div>
          <div v-if="showResetFiltersButton" class="mx-auto mt-4 mb-2">
            <button
              class="w-full justify-center py-2 px-6 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              @click="invokeCleanFilters"
              type="button"
            >
              {{ translations.listing.resetFilters
              }}<span
                class="w-6 h-6 i-carbon-close-filled inline-block align-middle ml-2"
              ></span>
            </button>
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>
