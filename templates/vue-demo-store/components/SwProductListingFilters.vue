<script setup lang="ts">
import {
  XMarkIcon,
} from '@heroicons/vue/24/solid';
import {
  computed,
  ComputedRef,
  provide,
  reactive,
  ref,
  UnwrapNestedRefs,
} from "vue";
import {
  CmsElementProductListing,
  CmsElementSidebarFilter,
  useListing,
} from "@shopware-pwa/composables-next";
import { ShopwareSearchParams } from "@shopware-pwa/types";
import {
  getTranslatedProperty,
} from "@shopware-pwa/helpers-next";
import SwProductListingFilter from './SwProductListingFilter.vue';

defineProps<{
  content: CmsElementProductListing | CmsElementSidebarFilter;
  listingType?: string;
}>();

const { category } = useCategory();
const currentFilters = ref<any[]>([]);
const route = useRoute();
const router = useRouter();
const {
  getCurrentSortingOrder,
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
}>({
  manufacturer: new Set(),
  properties: new Set(),
  "min-price": undefined,
  "max-price": undefined,
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
}, forceRemove: boolean = false) => {
  if (forceRemove) {
    sidebarSelectedFilters[code]?.delete(value);
  } else if (!["properties", "manufacturer"].includes(code)) {
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
      preventScroll: 1
    },
  });
};

const clearFilters = async () => {
  sidebarSelectedFilters.manufacturer.clear();
  sidebarSelectedFilters.properties.clear();
  sidebarSelectedFilters["min-price"] = undefined;
  sidebarSelectedFilters["max-price"] = undefined;
  search(searchCriteriaForRequest.value);
  await router.push({
    query: {
      ...filtersToQuery(searchCriteriaForRequest.value),
      preventScroll: 1
    },
  });
};

const selectedOptionIds = computed(() => [
  ...sidebarSelectedFilters.properties,
  ...sidebarSelectedFilters.manufacturer,
]);
provide("selectedOptionIds", selectedOptionIds);

async function invokeCleanFilters() {
  await search({});
  clearFilters();
}

watch([selectedOptionIds, getInitialFilters], ([value, list]) => {
  if (list.length && value.length) {
    const totalFilters = getInitialFilters.value.reduce((sum: any, x: any) => {
      let options: any[] = [];
      if (x.entities) {
        options = x.entities.map((y: any) => ({
          ...y,
          code: x.code
        }))
      } else if (x.options) {
        options = x.options.map((y: any) => ({
          ...y,
          code: x.code
        }))
      }
      if (options.length) {
        sum.push(...options);
      }
      return sum;
    }, []);
    currentFilters.value = value.map((x: any) => {
      return totalFilters.find((y: any) => y.id === x);
    });
  } else {
    currentFilters.value = [];
  }
}, {
  immediate: true
})
</script>
<template>
  <ClientOnly>
    <div class="mt-4">
      <p class="text-sm font-medium text-gray-700 mb-6">
        Filters
      </p>
      <div
        v-if="currentFilters.length"
        class="mb-8"
      >
        <div class="gap-2 flex flex-wrap mb-2">
          <div
            v-for="filter of currentFilters"
            class="flex items-center py-2.25 shadow-sm px-5 bg-gray-100"
          >
            <span class="text-gray-700 text-base font-medium">
              {{ getTranslatedProperty(filter, 'name') }}
            </span>
            <XMarkIcon
              class="ml-3 w-5 h-5 cursor-pointer text-gray-500"
              @click="onOptionSelectToggle({code: filter.code, value: filter.id})"
            />
          </div>
        </div>

        <button
          class="text-gray-900 py-2 underline font-medium text-base" 
          @click="invokeCleanFilters"
        >
          Clear all
        </button>
      </div>
    </div>
    <div
      v-if="getInitialFilters.length"
      class="flex flex-wrap"
    >
      <div
        v-for="filter in getInitialFilters"
        :key="`${filter?.id || filter?.code}`"
        class="w-full"
      >
        <SwProductListingFilter
          :selected-filters="getCurrentFilters"
          :filter="filter"
          class="relative"
          @selectFilterValue="onOptionSelectToggle"
        />
      </div>
    </div>
  </ClientOnly>
</template>
