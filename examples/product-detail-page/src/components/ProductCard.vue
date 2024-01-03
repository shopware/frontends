<script setup lang="ts">
import { computed, defineProps } from "vue";
import {
  getSmallestThumbnailUrl,
  getSrcSetForMedia,
} from "@shopware-pwa/helpers-next";
import {
  useAddToCart,
  useProductPrice,
  usePrice,
} from "@shopware-pwa/composables-next/dist";
import type { components } from "@shopware/api-client/api-types";
const props = defineProps<{
  product: components["schemas"]["Product"];
}>();

const product = computed(() => props.product);

const { unitPrice } = useProductPrice(product);
const { getFormattedPrice } = usePrice();
const { addToCart } = useAddToCart(product);
</script>
<template>
  <div
    class="mx-auto w-[320px] max-w-sm bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700"
  >
    <img
      class="p-8 rounded-t-lg"
      :alt="`image of ${product?.translated?.name}`"
      :src="getSmallestThumbnailUrl(product?.cover?.media)"
      :srcset="getSrcSetForMedia(product?.cover?.media)"
    />

    <div class="px-5 pb-5">
      <h5
        class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4"
      >
        {{ product?.translated?.name }}
      </h5>
      <div class="flex items-center justify-between">
        <span class="text-3xl font-bold text-gray-900 dark:text-white">{{
          getFormattedPrice(unitPrice)
        }}</span>
        <button
          @click="addToCart()"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          🛍 Add to cart
        </button>
      </div>
    </div>
  </div>
</template>
