<script setup lang="ts">
import {
  getProductTierPrices,
  getProductCalculatedListingPrice,
  getProductFromPrice,
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
const fromPrice = getProductFromPrice(props.product);
</script>

<template>
  <div>
    <template v-if="!fromPrice">
      <CatalogPrice
        v-if="showOriginalPrice && originalPrice"
        class="text-sm text-gray-900 basis-2/6 justify-end line-through"
        :value="originalPrice"
      />
      <CatalogPrice
        v-if="price"
        class="text-m text-gray-900 basis-2/6 justify-end"
        :class="{
          'text-red': showOriginalPrice,
        }"
        :value="price"
      />
    </template>
    <template v-else>
      <CatalogPrice
        v-if="showOriginalPrice && fromPrice"
        class="text-sm text-gray-900 basis-2/6 justify-end line-through"
        :value="fromPrice"
      >
        <template #beforePrice> From </template>
      </CatalogPrice>
    </template>
  </div>
</template>
