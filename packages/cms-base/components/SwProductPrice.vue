<script setup lang="ts">
import {
  getProductTierPrices,
  getProductCalculatedListingPrice,
} from "@shopware-pwa/helpers-next";

const props = defineProps({
  product: Object,
});

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
  <p class="text-3xl text-gray-900 basis-2/6 text-right">
    {{ price }} {{ currency?.symbol }}
  </p>
</template>
