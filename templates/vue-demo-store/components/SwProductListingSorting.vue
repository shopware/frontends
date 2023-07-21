<script setup lang="ts">
import {
  computed,
  UnwrapNestedRefs
} from "vue";
import {
  CmsElementProductListing,
  CmsElementSidebarFilter,
  useListing,
} from "@shopware-pwa/composables-next";
import {
  getTranslatedProperty,
} from "@shopware-pwa/helpers-next";
import { ShopwareSearchParams } from "@shopware-pwa/types";
import {
  FunnelIcon
} from '@heroicons/vue/24/solid';
import {
  Dialog,
  DialogPanel,
  TransitionRoot,
  TransitionChild
} from '@headlessui/vue';
import {
  XMarkIcon,
} from '@heroicons/vue/24/outline'

defineProps<{
  content: CmsElementProductListing | CmsElementSidebarFilter;
  listingType?: string;
}>();

const route = useRoute();
const router = useRouter();
const loading = ref<boolean>();

const filterMenuOpened = inject("filterMenuOpened", ref(false));

const currentFilters = ref<any[]>([]);

const close = () => {
  filterMenuOpened.value = false;
}

const {
  getCurrentSortingOrder,
  changeCurrentSortingOrder,
  getInitialFilters,
  getCurrentFilters,
  search,
  getTotal,
  filtersToQuery,
  getSortingOrders,
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
  try {
    loading.value = true;
    await search(searchCriteriaForRequest.value);
  } finally {
    loading.value = false;
  }
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

const handleSearch = async () => {
  filterMenuOpened.value = false;
  await search(searchCriteriaForRequest.value);
  await router.push({
    query: {
      ...filtersToQuery(searchCriteriaForRequest.value),
    },
  });
}

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
      <Partial<ShopwareSearchParams>>route.query
    );
  },
});

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
});

const getSortingOrdersOptions = computed(() => {
  return getSortingOrders.value.map(x => ({
    label: x.label,
    value: x.key
  }))
});
</script>
<template>
  <ClientOnly>
    <div class="flex gap-6 text-sm justify-between lg:justify-end mt-4 mb-4 lg:mb-6 w-full">
      <button class="flex-1 md:flex-none flex block lg:hidden" @click="filterMenuOpened = true">
        <FunnelIcon class="w-5 h-5 text-gray-500 mr-2"/>
        <span class="text-sm text-gray-700 font-medium">{{ $t('filter') }}</span>
      </button>
      <span class="text-center flex-1 md:flex-none text-sm text-gray-700">{{getTotal}} {{ $t('products') }}</span>
      <div class="flex-1 flex justify-end md:flex-none">
        <SwSelect
          name="language"
          v-model="currentSortingOrder"
          class="text-gray-700"
          :options="getSortingOrdersOptions"
        />
      </div>
    </div>
    <div class="block md:hidden mt-4">
      <div v-if="currentFilters.length" class="mb-6">
        <div class="gap-2 flex flex-wrap mb-4">
          <div v-for="filter of currentFilters" class="flex items-center py-2.25 shadow-sm px-5 bg-gray-100">
            <span class="text-gray-700 text-base font-medium">
              {{ getTranslatedProperty(filter, 'name') }}
            </span>
            <XMarkIcon class="ml-3 w-5 h-5 cursor-pointer text-gray-500" @click="onOptionSelectToggle({code: filter.code, value: filter.id})" />
          </div>
          <button class="text-gray-900 py-2 underline font-medium text-base"
            @click="invokeCleanFilters">
            {{ $t('clear_all') }}
          </button>
        </div>

      </div>
    </div>
    <TransitionRoot
      :show="filterMenuOpened"
      appear
      as="template"
    >
      <Dialog as="div" class="lg:hidden" @close="close">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 z-50 bg-gray-500 bg-opacity-60" />
        </TransitionChild>
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="duration-200 ease-in"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <DialogPanel class="flex flex-col fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div class="container py-6 flex items-center justify-between">
              <div>
                <h4 class="font-medium text-lg">{{ $t('filter') }}</h4>
              </div>
              <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700 outline-none" @click="close">
                <span class="sr-only">{{ $t('close_menu') }}</span>
                <XMarkIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div class="flex-1 min-h-0 overflow-y-auto" v-if="getInitialFilters.length">
              <div
                v-for="filter in getInitialFilters"
                :key="`${filter?.id || filter?.code}`"
                class="w-full"
              >
                <SwProductListingFilter
                  @selectFilterValue="onOptionSelectToggle"
                  :selectedFilters="getCurrentFilters"
                  :filter="filter"
                  class="relative"
                />
              </div>
            </div>
            <div class="container py-4">
              <button class="w-full text-white text-base font-medium py-3 px-6 bg-gray-800 shadow-sm disabled:opacity-50" :disabled="loading" @click="handleSearch">
                {{ $t('show_products', [getTotal]) }}
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </TransitionRoot>
  </ClientOnly>
</template>
