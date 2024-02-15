<script setup lang="ts">
import {
  useAddToCart,
  usePrice,
  useProductPrice,
  useCart,
  useProduct,
} from "@shopware-pwa/composables-next/dist";
import { getSmallestThumbnailUrl } from "@shopware-pwa/helpers-next";

import ProductCustomizedProductConfigurator from "@/components/ProductCustomizedProductConfigurator.vue";

const props = defineProps(["product"]);
useProduct(props.product);
const { addToCart } = useAddToCart(props.product);
const { refreshCart } = useCart();
const { getFormattedPrice } = usePrice();
const { totalPrice } = useProductPrice(props.product);

const proxyAddToCart = async () => {
  await addToCart();
  refreshCart();
};
</script>
<template>
  <div
    class="w-full max-w-sm bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
  >
    <img
      class="rounded-t-lg"
      :src="getSmallestThumbnailUrl(product.cover.media)"
      alt="Image presenting a product"
    />

    <div class="px-5 pb-5">
      <h5
        class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
      >
        {{ product?.translated?.name }}
      </h5>

      <div class="flex flex-col items-center justify-between mt-4">
        <span class="text-3xl font-bold text-gray-900 dark:text-white"
          >{{ getFormattedPrice(totalPrice) }} {{ totalPrice }}</span
        >
        <ProductCustomizedProductConfigurator />
        <button
          @click="proxyAddToCart"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add to cart
        </button>
      </div>
    </div>
  </div>
</template>
