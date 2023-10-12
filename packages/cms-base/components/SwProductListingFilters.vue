<script setup lang="ts">
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
import {
  computed,
  ComputedRef,
  provide,
  reactive,
  ref,
  UnwrapNestedRefs,
} from "vue";
import SwProductListingFilter from "./SwProductListingFilter.vue";
import {
  CmsElementProductListing,
  CmsElementSidebarFilter,
} from "@shopware-pwa/composables-next";
import { ShopwareSearchParams } from "@shopware-pwa/types";
import deepMerge from "../helpers/deepMerge";
import getTranslations from "../helpers/getTranslations";

const props = defineProps<{
  content: CmsElementProductListing | CmsElementSidebarFilter;
  listingType?: string;
}>();

type Translations = {
  listing: {
    sort: string;
    resetFilters: string;
  };
};

let translations: Translations = {
  listing: {
    sort: "Sort",
    resetFilters: "Reset filters",
  },
};

const globalTranslations = getTranslations();
translations = deepMerge(translations, globalTranslations) as Translations;

const { category } = useCategory();
const route = useRoute();
const router = useRouter();

const isSortMenuOpen = ref(false);
const {
  getCurrentSortingOrder,
  changeCurrentSortingOrder,
  getSortingOrders,
  getInitialFilters,
  search,
  getCurrentFilters,
  filtersToQuery,
} = useListing({ listingType: "categoryListing" });

const sidebarSelectedFilters: UnwrapNestedRefs<{
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

const searchCriteriaForRequest: ComputedRef<{
  [code: string]: string | string[] | number | number[] | boolean | undefined;
}> = computed(() => ({
  // turn Set to array and then into string with | separator
  manufacturer: [...sidebarSelectedFilters.manufacturer]?.join("|"),
  // turn Set to array and then into string with | separator
  properties: [...sidebarSelectedFilters.properties]?.join("|"),
  "min-price": sidebarSelectedFilters["min-price"],
  "max-price": sidebarSelectedFilters["max-price"],
  order: getCurrentSortingOrder.value,
  "shipping-free": sidebarSelectedFilters["shipping-free"],
  rating: sidebarSelectedFilters["rating"],
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
  value: any;
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

  await search(searchCriteriaForRequest.value);
  await router.push({
    query: {
      ...filtersToQuery(searchCriteriaForRequest.value),
    },
  });
};

const clearFilters = async () => {
  sidebarSelectedFilters.manufacturer.clear();
  sidebarSelectedFilters.properties.clear();
  sidebarSelectedFilters["min-price"] = undefined;
  sidebarSelectedFilters["max-price"] = undefined;
  sidebarSelectedFilters["rating"] = undefined;
  sidebarSelectedFilters["shipping-free"] = undefined;
  search(searchCriteriaForRequest.value);
  await router.push({
    query: {
      ...filtersToQuery(searchCriteriaForRequest.value),
    },
  });
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

    changeCurrentSortingOrder(
      order,
      <Partial<ShopwareSearchParams>>route.query,
    );
  },
});

const selectedOptionIds = computed(() => [
  ...sidebarSelectedFilters.properties,
  ...sidebarSelectedFilters.manufacturer,
]);
provide("selectedOptionIds", selectedOptionIds);

async function invokeCleanFilters() {
  await search({});
  clearFilters();
}

const dropdownElement = ref(null);
onClickOutside(dropdownElement, () => (isSortMenuOpen.value = false));
</script>
<template>
  <div class="bg-white">
    <div class="mx-auto m-0 px-5">
      <div
        class="relative lg:flex lg:items-baseline lg:justify-between pt-6 pb-6 border-b border-gray-200"
      >
        <div>
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">
            {{ getTranslatedProperty(category, "name") }}
          </h1>
        </div>

        <div class="flex items-center" ref="dropdownElement">
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
            @selectFilterValue="onOptionSelectToggle"
            :selectedFilters="getCurrentFilters"
            :filter="filter"
            class="relative"
          />
        </div>
        <div class="mx-auto mt-4 mb-2">
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
    </div>
  </div>
</template>
