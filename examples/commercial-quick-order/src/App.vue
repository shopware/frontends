<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {
  useSessionContext,
  useShopwareContext,
  useUser,
} from "@shopware-pwa/composables-next";
import { onClickOutside, useDebounceFn } from "@vueuse/core";

const { apiClient } = useShopwareContext();
// for initialize the session and get the current currency
const { currency, refreshSessionContext } = useSessionContext();
// to log in a customer, because the Quick Order feature is enabled for specifically selected users (in admin panel)
const { login } = useUser();

// init a session
refreshSessionContext();

// reference for file input in DOM
const csvFile = ref();
// reference to suggest search results
const outsideContext = ref();
// indicates whether show notification toast
const showSuccessToast = ref(false);
// content of the success message
const successToastMessage = ref("");
// store for received items (from API via search or file-upload action)
const ITEMS_CACHE = ref(new Map());
// store for locally selected items (to be added to the shopping cart later on)
const chosenItems = ref(new Map());
// container for product search response
const items = ref([]);
// indicates whether there are any items found in API
const hasItemsFound = computed(() => !!items.value.length);
// search query for suggest search parameter
const query = ref();
// indicated whether suggest results should be hidden
const forceCloseSuggest = ref(false);

// log in an user pointed in .env file (should be renamed from .env.template)
login({
  username: import.meta.env.VITE_TEST_LOGIN_EMAIL,
  password: import.meta.env.VITE_TEST_LOGIN_PASSWORD,
});

// close the suggest search results on click outside
onClickOutside(outsideContext, () => {
  forceCloseSuggest.value = true;
});

// show a message and then close it in 3 seconds
const showToastMessage = (message: string) => {
  successToastMessage.value = message;
  showSuccessToast.value = true;
  setTimeout(() => {
    showSuccessToast.value = false;
  }, 3000);
};

// used in suggest search bar
const search = async (phrase: string) => {
  const response = await apiClient.invoke(
    `quickOrderProductSearch get /store-api/quick-order/product?search`,
    {
      search: phrase,
    },
  );
  items.value = response?.elements;
  forceCloseSuggest.value = false;
};

// clear the list and show the message
const onClearListClick = () => {
  chosenItems.value = new Map();
  showToastMessage("List has been cleared.");
};

// add item to the chosenItems list
// or increment a quantity if already exists
// if the item comes from a file upload, assign quantity value from csv
const onItemClick = (item) => {
  if (chosenItems.value.has(item.id)) {
    chosenItems.value.set(
      item.id,
      chosenItems.value.get(item.id) + (item.quantity || 1),
    );
  } else {
    ITEMS_CACHE.value.set(item.id, item);
    chosenItems.value.set(item.id, item.quantity || 1);
  }
  forceCloseSuggest.value = true;
  query.value = "";
  showToastMessage("Product has been added to list.");
};

const onAddToCartClick = async () => {
  const lineItemsPayload = Array.from(chosenItems.value.entries()).map(
    ([productId, quantity]) => ({
      referencedId: productId,
      quantity,
      type: "product",
    }),
  );

  await apiClient.invoke("addLineItem post /checkout/cart/line-item", {
    items: lineItemsPayload as Array<{
      id?: string;
      referencedId: string;
      quantity?: number;
      type: "product" | "promotion" | "custom" | "credit";
    }>,
  });

  chosenItems.value = new Map();
  showToastMessage("The items have been moved to the cart.");
};

// set the new quantity value for a given item
const onItemQtyChange = (event, itemId: string) => {
  const value = event.target.value;
  chosenItems.value.set(itemId, +value);
  showToastMessage("The quantity has been changed.");
};

// detects if someone uploads a file
// then send it to the quick-order endpoint (from commercial b2b extension)
// iterate over items found (products from API) and add them to the store (chosenItems Map)
const onCsvFileChange = async (event) => {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append("file", file);
  const headers = { "Content-Type": "multipart/form-data" };
  const foundProductsResponse = await apiClient.invoke(
    `quickOrderLoadFile post /store-api/quick-order/load-file`,
    { formData },
  );

  for (const item of foundProductsResponse.products) {
    onItemClick(item);
  }

  csvFile.value.value = null;
};

// search in 500ms delay wrapper
const debounceSearch = useDebounceFn(search, 500);

// watch for search query changes
watch(query, (value) => {
  if (value?.length <= 1) {
    forceCloseSuggest.value = true;
    return;
  }
  debounceSearch(value);
});
</script>
<template>
  <div test-id="test-wrapper">
    {{ csvFile?.file?.files }}
    <div class="w-full mb-2">
      <button
        type="button"
        @click="onClearListClick"
        :disabled="!chosenItems.size"
        :class="[
          !chosenItems.size
            ? 'cursor-not-allowed bg-gray-300 dark:bg-gray-400 '
            : 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-700',
        ]"
        class="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Clear list
      </button>
      <div
        class="inline-block text-white font-medium rounded-lg text-sm ml-2 text-center"
      >
        <input
          ref="csvFile"
          @change="onCsvFileChange"
          class="block p-1.5 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          aria-describedby="file_input_help"
          id="file_input"
          type="file"
          accept=".csv"
        />
      </div>
      <button
        type="button"
        @click="onAddToCartClick"
        :disabled="!chosenItems.size"
        :class="[
          !chosenItems.size
            ? 'cursor-not-allowed bg-gray-300 dark:bg-gray-400 '
            : 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-700',
        ]"
        class="ml-2 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex"
      >
        <svg
          class="w-3.5 h-3.5 mr-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 18 21"
        >
          <path
            d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z"
          />
        </svg>
        Add selected items to shopping cart
      </button>
    </div>
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
            placeholder="Search products..."
            required
          />
        </div>
      </form>
      <div
        ref="outsideContext"
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
                    ? 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-600'
                    : 'border-b bg-gray-100 dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-600',
                ]"
                class="hover:cursor-pointer"
              >
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {{ item.translated?.name || item.name }}
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
                  {{ item?.calculatedPrice?.totalPrice }} {{ currency?.symbol }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        v-if="chosenItems.size"
        class="result mt-2"
        :class="{ 'blur-md': !!hasItemsFound && !forceCloseSuggest }"
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
                  {{
                    ITEMS_CACHE.get(item)?.translated?.name ||
                    ITEMS_CACHE.get(item)?.name
                  }}
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
                  {{ ITEMS_CACHE.get(item)?.calculatedPrice?.totalPrice }}
                  {{ currency?.symbol }}
                </td>
                <td class="px-6 py-4 text-center">
                  <div>
                    <input
                      min="1"
                      :value="quantity"
                      @change="onItemQtyChange($event, item)"
                      type="number"
                      id="first_product"
                      class="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="1"
                      required
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div
      v-show="showSuccessToast"
      id="toast-success"
      class="absolute bottom-0 right-4 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
      role="alert"
    >
      <div
        class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
      >
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
          />
        </svg>
        <span class="sr-only">Check icon</span>
      </div>
      <div class="ml-3 text-sm font-normal">{{ successToastMessage }}</div>
      <button
        type="button"
        class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        data-dismiss-target="#toast-success"
        aria-label="Close"
      >
        <span class="sr-only">Close</span>
        <svg
          class="w-3 h-3"
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
    </div>
  </div>
</template>
