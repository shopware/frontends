<script setup lang="ts">
import {
  getProductTierPrices,
  getProductCalculatedListingPrice,
} from "@shopware-pwa/helpers-next";

import { Product } from "@shopware-pwa/types";

const props = defineProps<{
  product: Product;
}>();

const { currency, refreshSessionContext } = useSessionContext();
refreshSessionContext();

const price = computed(() => {
  const tierPrices = getProductTierPrices(props.product);
  return (
    (tierPrices.length && tierPrices[0] && tierPrices[0].unitPrice) ||
    getProductCalculatedListingPrice(props.product)
  );
});
</script>

<template>
  <SwPrice
    v-if="price"
    class="text-3xl text-gray-900 basis-2/6 justify-end"
    :value="price"
  />
</template>
