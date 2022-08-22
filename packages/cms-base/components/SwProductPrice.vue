<script setup lang="ts">
import {
  getProductTierPrices,
  getProductCalculatedListingPrice,
} from "@shopware-pwa/helpers-next";

import { Product } from "@shopware-pwa/types";

const props = defineProps<{
  product: Product;
}>();

const originalPrice = computed(() => {
  const tierPrices = getProductTierPrices(props.product);
  return (
    (tierPrices.length && tierPrices[0] && tierPrices[0].unitPrice) ||
    getProductCalculatedListingPrice(props.product)
  );
});

const price = computed(() => props.product.calculatedPrice.totalPrice);

const showOriginalPrice = computed(
  () => price && originalPrice && (originalPrice.value || 0) > price.value
);
</script>

<template>
  <div>
    <SwPrice
      v-if="showOriginalPrice && originalPrice"
      class="text-1xl text-gray-900 basis-2/6 justify-end line-through"
      :value="originalPrice"
    />
    <SwPrice
      v-if="price"
      class="text-3xl text-gray-900 basis-2/6 justify-end"
      :class="{
        'text-red': showOriginalPrice,
      }"
      :value="price"
    />
  </div>
</template>
