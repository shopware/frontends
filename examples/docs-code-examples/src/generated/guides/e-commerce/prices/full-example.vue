<script setup>
import { useProduct } from "@shopware/composables";

const { getFormattedPrice } = usePrice();
const { product, search } = useProduct();

await search("some-product-id");

// If there is exactly one pricing tier, use it as the default price.
// Otherwise use the calculatedPrice
const defaultPrice = computed(() => {
  if (product.value?.calculatedPrices?.length === 1) {
    return product.value.calculatedPrices[0];
  }
  return product.value?.calculatedPrice;
});
</script>

<template>
  <ul v-if="product.calculatedPrices.length > 1">
    <!-- Show pricing tiers -->
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

  <div v-else>
    <!-- Show default price -->
    <div>
      {{ getFormattedPrice(defaultPrice.totalPrice) }}
      <small> incl. {{ defaultPrice.taxRules[0].taxRate }}% tax </small>
    </div>
    <div v-if="!!defaultPrice.listPrice">
      <small>
        <del>
          {{ getFormattedPrice(defaultPrice.listPrice.price) }}
        </del>
        (-{{ defaultPrice.listPrice.percentage }}%)
      </small>
    </div>
  </div>
</template>
