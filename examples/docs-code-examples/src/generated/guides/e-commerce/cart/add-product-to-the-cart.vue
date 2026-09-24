<script setup lang="ts">
import { ref } from "vue";

import { useAddToCart } from "#imports";
import type { Schemas } from "#shopware";

const product = ref({
  id: "7b5b97bd48454979b14f21c8ef38ce08",
  availableStock: 10,
} as Schemas["Product"]);
const { addToCart, quantity, getAvailableStock } = useAddToCart(product);
</script>
<template>
  Only {{ getAvailableStock }} in stock<br />
  <input v-model="quantity" type="number" />
  <button @click="addToCart()">Add to cart</button>
</template>
