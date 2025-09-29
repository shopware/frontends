<script setup lang="ts">
import type {
  CmsElementProductListing,
  CmsElementSidebarFilter,
} from "@shopware/composables";
import { useCmsTranslations } from "@shopware/composables";
import { onClickOutside } from "@vueuse/core";
import { defu } from "defu";
import { computed, provide, reactive, ref, useTemplateRef } from "vue";
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
    selectedOptionIds.value.length !== 0 ||
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

const onOptionSelectToggle = async ({
  code,
  value,
}: {
  code: string;
  value: string | number | boolean;
}) => {
  try {
    if (!isValidFilterCode(code)) {
      console.warn(`Invalid filter code: ${code}`);
      return;
    }

    if (["properties", "manufacturer"].includes(code)) {
      const filterSet = sidebarSelectedFilters[code] as Set<string>;
      if (!filterSet) return;

      const stringValue = String(value);
      if (filterSet.has(stringValue)) {
        filterSet.delete(stringValue);
      } else {
        filterSet.add(stringValue);
      }
    } else {
      if (code === "min-price" || code === "max-price") {
        sidebarSelectedFilters[code] =
          typeof value === "number" ? value : Number(value);
      } else if (code === "rating") {
        sidebarSelectedFilters[code] = Number(value);
      } else if (code === "shipping-free") {
        sidebarSelectedFilters[code] = Boolean(value);
      }
    }

    await executeSearch();
  } catch (error) {
    console.error("Filter toggle failed:", error);
  }
};

function isValidFilterCode(code: string): code is keyof FilterState {
  return code in sidebarSelectedFilters;
}

const executeSearch = async () => {
  try {
    await search(searchCriteriaForRequest.value);
    const query = filtersToQuery(searchCriteriaForRequest.value);
    const { limit: _, ...queryWithoutLimit } = query;

    await router.push({
      query: queryWithoutLimit as LocationQueryRaw,
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

const selectedOptionIds = computed(() => [
  ...(sidebarSelectedFilters.properties as Set<string>),
  ...(sidebarSelectedFilters.manufacturer as Set<string>),
]);
provide("selectedOptionIds", selectedOptionIds);

async function invokeCleanFilters() {
  try {
    clearFilters();
    await executeSearch();
  } catch (error) {
    console.error("Clear filters failed:", error);
  }
}

const isDefaultSidebarFilter =
  props.content.type === "sidebar-filter" &&
  props.content.config?.boxLayout?.value === "standard";

const dropdownElement = useTemplateRef("dropdownElement");
onClickOutside(dropdownElement, () => {
  isSortMenuOpen.value = false;
});

const handleSortingClick = (key: string) => {
  currentSortingOrder.value = key;
  isSortMenuOpen.value = false;
};
</script>
<template>
  <div>
    <div class="self-stretch flex flex-col justify-start items-start gap-4">
      <div class="flex flex-row items-center justify-between w-full py-3 border-b border-outline-outline-variant">
        <div class="flex-1 text-surface-on-surface text-base font-bold font-['Inter'] leading-normal mb-8">
          {{ translations.listing.filters }}
        </div>
        <div ref="dropdownElement" class="flex items-center">
          <div class="relative inline-block text-left">
            <button type="button" @click="isSortMenuOpen = !isSortMenuOpen"
              class="group inline-flex justify-center bg-transparent text-base font-medium text-surface-on-surface-variant hover:text-surface-on-surface"
              id="menu-button" aria-expanded="false" aria-haspopup="true">
              {{ translations.listing.sort }}
              <span class="ml-1">
                <span v-if="!isSortMenuOpen" class="i-carbon-chevron-down h-5 w-5"></span>
                <span v-else class="i-carbon-chevron-up h-5 w-5"></span>
              </span>
            </button>
            <div :class="[isSortMenuOpen ? 'absolute' : 'hidden']"
              class="origin-top-left left-0 lg:origin-top-right lg:right-0 lg:left-auto mt-2 w-40 rounded-md shadow-2xl bg-surface-surface ring-1 ring-opacity-dark-low focus:outline-none z-1000"
              role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
              <div class="py-1" role="none">
                <button v-for="sorting in getSortingOrders" :key="sorting.key" @click="handleSortingClick(sorting.key)"
                  :class="[
                    sorting.key === getCurrentSortingOrder
                      ? 'font-medium text-surface-on-surface'
                      : 'text-surface-on-surface-variant',
                  ]" class="block px-4 py-2 text-sm bg-transparent hover:bg-surface-surface-container"
                  role="menuitem" tabindex="-1">
                  {{ sorting.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Filters List -->
    <div class="self-stretch flex flex-col justify-start items-start gap-4" v-if="getInitialFilters.length">
      <div v-for="filter in getInitialFilters" :key="`${filter?.id || filter?.code}`" class="mb-2 w-full">
        <SwProductListingFilter @select-filter-value="onOptionSelectToggle" :selected-filters="getCurrentFilters"
          :filter="filter" class="relative" />
      </div>
      <div v-if="showResetFiltersButton" class="mx-auto mt-4 mb-2 w-full">
        <button
          class="w-full justify-center py-2 px-6 border border-transparent shadow-sm text-md font-medium rounded-md text-brand-on-primary bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
          @click="invokeCleanFilters" type="button">
          {{ translations.listing.resetFilters }}
          <span class="w-6 h-6 i-carbon-close-filled inline-block align-middle ml-2"></span>
        </button>
      </div>
    </div>
  </div>
</template>
