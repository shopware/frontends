<script setup lang="ts">
import { computed, defineProps, ref } from "vue";
import type { components } from "@shopware/api-client/api-types";
import {
  getSmallestThumbnailUrl,
  getSrcSetForMedia,
} from "@shopware-pwa/helpers-next";
import {
  useAddToCart,
  useProductPrice,
  usePrice,
  useProductAssociations,
} from "@shopware-pwa/composables-next/dist";
import ProductCard from "./ProductCard.vue";

const props = defineProps<{
  product: components["schemas"]["Product"];
}>();

const product = computed(() => props.product);

const activeTab = ref<
  "product-description" | "product-properties" | "product-cross-sell"
>("product-description");

const { addToCart } = useAddToCart(product);
const { loadAssociations, isLoading, productAssociations } =
  useProductAssociations(product, {
    associationContext: "cross-selling",
  });

const recommendedTabLoaded = ref<boolean>(false);
const openRecommendedTab = async () => {
  activeTab.value = "product-cross-sell";
  if (recommendedTabLoaded.value) {
    return;
  }

  await loadAssociations({
    method: "post",
    searchParams: {
      associations: {
        media: {},
        cover: {
          associations: {
            media: {},
          },
        },
      },
    },
  });

  recommendedTabLoaded.value = true;
};
const addToCartProxy = async () => {
  await addToCart();
  console.info(`${product.value.translated.name} has been added to cart`);
};

const { unitPrice, price } = useProductPrice(product);
const regulationPrice = computed(() => price.value?.regulationPrice?.price);
const { getFormattedPrice } = usePrice({
  localeCode: "de-DE",
  currencyCode: "EUR",
});

const productName = computed(() => product.value?.translated?.name);
const manufacturer = computed(() => product.value?.manufacturer?.name);
const description = computed(() => product.value?.translated?.description);
const productNumber = computed(() => product.value?.productNumber);
const purchaseUnit = computed(() => product.value?.purchaseUnit);
const unitName = computed(() => product.value?.unit?.name);
</script>
<template>
  <div class="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
    <div class="xl:w-2/6 lg:w-2/5 w-80 md:block hidden">
      <img
        class="w-full"
        :alt="`image of ${product?.translated?.name}`"
        :src="getSmallestThumbnailUrl(product?.cover.media)"
        :srcset="getSrcSetForMedia(product?.cover.media)"
      />
    </div>
    <div class="md:hidden">
      <img
        class="w-full"
        :alt="`image of ${product?.translated?.name}`"
        :src="getSmallestThumbnailUrl(product?.cover.media)"
        :srcset="getSrcSetForMedia(product?.cover.media)"
      />
    </div>
    <div class="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
      <div class="border-b border-gray-200 pb-6">
        <p class="text-sm leading-none text-gray-600 dark:text-gray-300">
          {{ manufacturer }}
        </p>
        <h1
          class="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 dark:text-white mt-2"
        >
          {{ productName }}
        </h1>
      </div>
      <div
        v-if="product?.options?.length > 0"
        class="py-4 border-b border-gray-200 flex items-center justify-between"
      >
        <p class="text-base leading-4 text-gray-800 dark:text-gray-300">
          {{ product?.options?.[0]?.group.translated?.name }}
        </p>
        <div class="flex items-center justify-center">
          <p class="text-sm leading-none text-gray-600 dark:text-gray-300">
            {{ product?.options?.[0]?.translated?.name }}
          </p>
        </div>
      </div>

      <div class="mb-12">
        <div
          class="inline-flex w-1/3 p-4 pl-0 items-center justify-center font-bold text-2xl drop-shadow"
        >
          {{ getFormattedPrice(unitPrice) }}
          {{ regulationPrice ? "*" : "" }}
        </div>
        <button
          @click="addToCartProxy()"
          class="mt-4 w-2/3 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
        >
          <span
            class="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
          >
            🛍 Add to cart
          </span>
        </button>
        <span class="text-xs text-gray-500" v-if="regulationPrice"
          >Previous price: {{ getFormattedPrice(regulationPrice) }}</span
        >
      </div>

      <div
        class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
      >
        <ul class="flex flex-wrap -mb-px">
          <li class="mr-2">
            <a
              href="#"
              @click="activeTab = 'product-description'"
              class="inline-block p-4 rounded-t-lg hover:text-gray-800"
              :class="{
                'active border-gray-800 text-gray-800 border-b-2':
                  activeTab == 'product-description',
              }"
              >Description</a
            >
          </li>
          <li class="mr-2">
            <a
              href="#"
              @click="activeTab = 'product-properties'"
              class="inline-block p-4 rounded-t-lg hover:text-gray-800"
              :class="{
                'active border-gray-800 text-gray-800 border-b-2  ':
                  activeTab == 'product-properties',
              }"
              >Properties</a
            >
          </li>
          <li class="mr-2">
            <a
              href="#"
              @click="openRecommendedTab()"
              class="inline-block p-4 rounded-t-lg hover:text-gray-800"
              :class="{
                'active border-gray-800 text-gray-800 border-b-2  ':
                  activeTab == 'product-cross-sell',
              }"
              >Recommended</a
            >
          </li>
        </ul>
      </div>

      <div v-show="activeTab === 'product-properties'">
        <table
          class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
        >
          <tbody>
            <tr class="bg-white dark:bg-gray-800">
              <th
                scope="row"
                class="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Product code
              </th>
              <td class="py-4">
                {{ productNumber }}
              </td>
            </tr>
            <tr class="bg-white dark:bg-gray-800">
              <th
                scope="row"
                class="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Unit name
              </th>
              <td class="py-4">
                {{ unitName }}
              </td>
            </tr>
            <tr class="bg-white dark:bg-gray-800">
              <th
                scope="row"
                class="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Purchase unit
              </th>
              <td class="py-4">
                {{ purchaseUnit }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-show="activeTab === 'product-description'"
        class="text-base lg:leading-tight leading-normal text-gray-600 dark:text-gray-300 mt-7"
        v-html="description"
      ></div>
      <div
        v-show="activeTab === 'product-cross-sell'"
        class="text-base lg:leading-tight leading-normal text-gray-600 dark:text-gray-300 mt-7"
      >
        <svg
          v-if="isLoading"
          aria-hidden="true"
          role="status"
          class="inline w-6 h-6 mr-3 mb-4 text-gray-200 animate-spin dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="#1C64F2"
          />
        </svg>
        <div>
          <div v-if="productAssociations?.length > 0 && !isLoading">
            <ProductCard
              v-for="productItem in productAssociations?.[0]?.products"
              :product="productItem"
            />
          </div>
          <div v-else>
            <div
              class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
              role="alert"
            >
              <span class="font-medium">Empty space!</span>There are no products
              here... 😔
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
