<script setup lang="ts">
import {
  getProductName,
  getProductTierPrices,
  getProductCalculatedListingPrice,
  getProductThumbnailUrl,
  getProductUrl,
} from "@shopware-pwa/helpers-next";

import { Product } from "@shopware-pwa/types";
const { pushSuccess } = useNotifications();

const props = defineProps<{
  product: Product;
}>();

const { addToCart } = useAddToCart({
  product: props.product,
});

const addToCartProxy = async () => {
  await addToCart();
  pushSuccess(`${props.product?.translated?.name} has been added to cart.`);
};

// const { formatPrice } = usePriceFilter();

function getPrice(product: Product) {
  const tierPrices = getProductTierPrices(product);
  return (
    (tierPrices.length && tierPrices[0] && tierPrices[0].unitPrice) ||
    getProductCalculatedListingPrice(product)
  );
}
</script>

<template>
  <div class="group relative">
    <div
      class="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none"
    >
      <img
        :src="getProductThumbnailUrl(product)"
        :alt="getProductName({ product }) || ''"
        class="w-full h-full min-h-80 object-fill object-cover lg:w-full lg:h-full"
      />
    </div>
    <div class="mt-4 justify-between h-40">
      <div>
        <h3 class="text-sm text-gray-700">
          <router-link :to="getProductUrl(product)">
            <span
              aria-hidden="true"
              class="absolute inset-0 bottom-40px"
            ></span>
            {{ getProductName({ product }) }}
          </router-link>
        </h3>
        <p class="mt-2 text-sm text-gray-500 h-20 overflow-hidden">
          <span> {{ product.description }} </span>
        </p>
        <p class="mt-1 text-sm text-gray-500 min-h-30px">
          <!-- TODO: handle product options displaying and work out a Product type -->
          <!-- <span
            v-for="option in product?.options"
            :key="option.group"
            class="mr-2"
          >
            {{ option.group }}: {{ option.option }}
          </span> -->
        </p>
      </div>
      <div class="mt-3">
        <p class="text-sm font-medium text-gray-900">
          {{ getPrice(product) }} EUR
        </p>
      </div>
    </div>
    <div class="mt-3">
      <button
        type="button"
        @click="addToCartProxy"
        class="mt-3 w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Add to basket
      </button>
    </div>
  </div>
</template>
