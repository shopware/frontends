<script setup lang="ts">
import { CmsPage } from "@shopware-pwa/types";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
import {
  computed,
  ComputedRef,
  inject,
  provide,
  reactive,
  ref,
  UnwrapNestedRefs,
} from "vue";
import SwProductListingFilter from "./SwProductListingFilter.vue";
import {
  CmsElementProductListing,
  CmsElementSidebarFilter,
  useListing,
} from "@shopware-pwa/composables-next";

defineProps<{
  content: CmsElementProductListing | CmsElementSidebarFilter;
  listingType?: string;
}>();

const cmsPage = inject<ComputedRef<CmsPage>>("cms-page");
const category = computed(() => cmsPage?.value?.category);
const isSortMenuOpen = ref(false);
const {
  getCurrentSortingOrder,
  changeCurrentSortingOrder,
  getSortingOrders,
  getInitialFilters,
  search,
  getCurrentFilters,
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
  manufacturer: [...sidebarSelectedFilters.manufacturer],
  properties: [...sidebarSelectedFilters.properties],
  "min-price": sidebarSelectedFilters["min-price"],
  "max-price": sidebarSelectedFilters["max-price"],
  order: getCurrentSortingOrder.value,
  "shipping-free": sidebarSelectedFilters["shipping-free"],
  rating: sidebarSelectedFilters["rating"],
}));

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
};

const clearFilters = () => {
  sidebarSelectedFilters.manufacturer.clear();
  sidebarSelectedFilters.properties.clear();
  sidebarSelectedFilters["min-price"] = undefined;
  sidebarSelectedFilters["max-price"] = undefined;
  sidebarSelectedFilters["rating"] = undefined;
  sidebarSelectedFilters["shipping-free"] = undefined;
  search(searchCriteriaForRequest.value);
};

const currentSortingOrder = computed({
  get: (): string => getCurrentSortingOrder.value || "",
  set: (order: string): Promise<void> => changeCurrentSortingOrder(order),
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
  <ClientOnly>
    <div class="bg-white">
      <main class="mx-auto">
        <div
          class="relative flex items-baseline justify-between pt-6 pb-6 border-b border-gray-200"
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
                  class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                  id="menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  Sort
                  <svg
                    :class="[
                      'flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500',
                      { hidden: isSortMenuOpen },
                    ]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    :class="[
                      'flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500',
                      { hidden: !isSortMenuOpen },
                    ]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div
                :class="[isSortMenuOpen ? 'absolute' : 'hidden']"
                class="origin-top-right right-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-1000"
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
                    class="block px-4 py-2 text-sm"
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

        <div class="flex flex-wrap">
          <p
            v-for="filter in getInitialFilters"
            :key="`${filter?.id || filter?.code}`"
            class="px-4 py-6 mb-2"
          >
            <SwProductListingFilter
              @selectFilterValue="onOptionSelectToggle"
              :selectedFilters="getCurrentFilters"
              :filter="filter"
              class="relative"
            />
          </p>
          <div class="text-center pl-4 pr-4 mt-4">
            <button
              class="w-full justify-center py-2 px-6 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              @click="invokeCleanFilters"
              type="button"
            >
              Reset filters
            </button>
          </div>
        </div>
      </main>
    </div>
  </ClientOnly>
</template>
