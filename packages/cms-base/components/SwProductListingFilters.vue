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
  useListing,
} from "@shopware-pwa/composables-next";

defineProps<{
  content: CmsElementProductListing | CmsElementSidebarFilter;
  listingType?: string;
}>();

const { category } = useCategory();

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

        <div class="flex flex-wrap" v-if="getInitialFilters.length">
          <div
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
          </div>
          <div class="text-center pl-4 pr-4 mt-4">
            <button
              class="w-full justify-center py-2 px-6 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              @click="invokeCleanFilters"
              type="button"
            >
              Reset filters<span
                class="w-6 h-6 i-carbon-close-filled inline-block align-middle ml-2"
              ></span>
            </button>
          </div>
        </div>
      </main>
    </div>
    <template #placeholder>
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

            <div class="text-sm font-medium text-gray-700 hover:text-gray-900">
              Sort
            </div>
            <div class="i-carbon-chevron-down h-5 w-5 ml-1"></div>
          </div>
          <div class="flex flex-wrap" v-show="!getInitialFilters.length">
            <div class="flex pl-2 flex-wrap">
              <div class="py-3 mb-2 mr-4 max-w-sm animate-pulse">
                <div
                  class="border-1 bg-gray-200 dark:bg-gray-700px-2 py-3 w-42 h-12 text-gray-400 hover:text-gray-500 rounded"
                ></div>
              </div>
              <div class="py-3 max-w-sm animate-pulse">
                <div
                  class="border-1 bg-gray-200 dark:bg-gray-700px-2 py-3 w-25 h-12 text-gray-400 hover:text-gray-500 rounded"
                ></div>
              </div>
              <div class="py-3 ml-4 mb-2 max-w-sm animate-pulse">
                <div
                  class="border-1 bg-gray-200 dark:bg-gray-700px-2 py-3 w-25 h-12 text-gray-400 hover:text-gray-500 rounded"
                ></div>
              </div>
              <div class="py-3 mb-2 max-w-sm animate-pulse">
                <div
                  class="border-1 bg-gray-200 dark:bg-gray-700px-2 py-3 w-42 h-12 text-gray-400 hover:text-gray-500 rounded"
                ></div>
              </div>
              <div class="py-3 mb-2 max-w-sm animate-pulse">
                <div
                  class="border-1 bg-gray-200 dark:bg-gray-700px-2 py-3 w-42 h-12 text-gray-400 hover:text-gray-500 rounded"
                ></div>
              </div>
              <div class="py-3 mb-2 max-w-sm animate-pulse">
                <div
                  class="border-1 bg-gray-200 dark:bg-gray-700px-2 py-3 w-42 h-12 text-gray-400 hover:text-gray-500 rounded"
                ></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </template>
  </ClientOnly>
</template>
