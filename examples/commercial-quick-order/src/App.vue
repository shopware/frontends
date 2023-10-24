<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {
  useSessionContext,
  useShopwareContext,
} from "@shopware-pwa/composables-next";

const { apiInstance } = useShopwareContext();
const { currency, refreshSessionContext } = useSessionContext();

const ITEMS_CACHE = ref(new Map());
const chosenItems = ref(new Map());
const items = ref([]);
const hasItemsFound = computed(() => !!items.value.length);
refreshSessionContext();
const search = async (phrase: string) => {
  const response = await apiInstance.invoke.get(
    `/store-api/quick-order/product?search=${phrase}`,
  );
  items.value = response?.data?.elements;
};

const query = ref();
const forceCloseSuggest = ref(false);

const onItemClick = (item) => {
  //console.warn('adding item', item);
  if (chosenItems.value.has(item.id)) {
    chosenItems.value.set(item.id, chosenItems.value.get(item.id) + 1);
  } else {
    ITEMS_CACHE.value.set(item.id, item);
    chosenItems.value.set(item.id, 1);
  }

  console.warn("addedItems", chosenItems.value);
};

watch(query, (value) => {
  search(value);
  forceCloseSuggest.value = false;
});
</script>
<template>
  <div>
    <div class="relative">
      <form>
        <label
          for="default-search"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >Search</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            v-model="query"
            type="search"
            id="default-search"
            class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Mockups, Logos..."
            required
          />
        </div>
      </form>
      <div
        :class="{ hidden: !hasItemsFound || forceCloseSuggest }"
        class="absolute w-full z-10 suggest mt-0 p-0 overflow shadow"
      >
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table
            class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
          >
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th scope="col" class="px-6 py-3">Product name</th>
                <th scope="col" class="px-6 py-3">Product number</th>
                <th scope="col" class="px-6 py-3">Option</th>
                <th scope="col" class="px-6 py-3">Price</th>
              </tr>
            </thead>
            <tbody class="relative">
              <tr
                @click="onItemClick(item)"
                v-for="(item, index) in items"
                :key="item.id"
                :class="[
                  index % 2 == 1
                    ? 'bg-gray-50 dark:bg-gray-800'
                    : 'border-b dark:bg-gray-900 dark:border-gray-700',
                ]"
              >
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {{ item.translated?.name }}
                </th>
                <td class="px-6 py-4">{{ item.productNumber }}</td>
                <td class="px-6 py-4">
                  <span
                    v-for="option in item.options"
                    :key="option.id"
                    class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300"
                    >{{ option?.group.translated?.name }}:
                    {{ option?.translated?.name }}</span
                  >
                </td>

                <td class="px-6 py-4">
                  {{ item.calculatedPrice.totalPrice }} {{ currency?.symbol }}
                </td>
              </tr>
              <button
                @click="forceCloseSuggest=true"
                type="button"
                class="absolute right-2 bottom-2 ml-auto -mx-1 -my-1 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-6 w-6 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                data-dismiss-target="#toast-warning"
                aria-label="Close"
              >
                <span class="sr-only">Close</span>
                <svg
                  class="w-2 h-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="chosenItems.size" class="result mt-2" :class="{ 'blur-md': !!hasItemsFound && !forceCloseSuggest }">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table
            class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
          >
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th scope="col" class="px-6 py-3">Product name</th>
                <th scope="col" class="px-6 py-3">Product number</th>
                <th scope="col" class="px-6 py-3">Option</th>
                <th scope="col" class="px-6 py-3">Price</th>
                <th scope="col" class="px-6 py-3">Quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="([item, quantity], index) in chosenItems.entries()"
                :key="ITEMS_CACHE.get(item)?.id"
                :class="[
                  index % 2 == 1
                    ? 'bg-gray-50 dark:bg-gray-800'
                    : 'border-b dark:bg-gray-900 dark:border-gray-700',
                ]"
              >
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {{ ITEMS_CACHE.get(item)?.translated?.name }}
                </th>
                <td class="px-6 py-4">
                  {{ ITEMS_CACHE.get(item)?.productNumber }}
                </td>
                <td class="px-6 py-4">
                  <span
                    v-for="option in ITEMS_CACHE.get(item)?.options"
                    :key="option.id"
                    class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300"
                    >{{ option?.group.translated?.name }}:
                    {{ option?.translated?.name }}</span
                  >
                </td>

                <td class="px-6 py-4">
                  {{ ITEMS_CACHE.get(item)?.calculatedPrice.totalPrice }}
                  {{ currency?.symbol }}
                </td>
                <td class="px-6 py-4 text-center">
                  {{ quantity }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
