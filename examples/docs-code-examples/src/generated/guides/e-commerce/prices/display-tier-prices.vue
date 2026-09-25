<script setup>
import { useProduct } from "@shopware/composables";

import { usePrice } from "#imports";

const { getFormattedPrice } = usePrice();
const { product, search } = useProduct();

await search("some-product-id");
</script>

<template>
  <ul>
    <li
      v-for="(tierPrice, index) in product.calculatedPrices"
      :key="tierPrice.quantity"
    >
      <!-- Display "from" or "to" depending on quantity level -->
      {{ index == product.calculatedPrices.length - 1 ? "from" : "to" }}
      {{ tierPrice.quantity }} -
      {{ getFormattedPrice(tierPrice.unitPrice) }}
    </li>
  </ul>
</template>
