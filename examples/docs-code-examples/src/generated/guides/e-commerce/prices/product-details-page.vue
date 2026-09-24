<script setup lang="ts">
import { ref } from "vue";

import { useProductPrice } from "#imports";
import type { Schemas } from "#shopware";

const product = ref({} as Schemas["Product"]);
const { hasListPrice, price, totalPrice } = useProductPrice(product);
</script>

<template>
  <div v-if="hasListPrice" class="old-price line-through">
    {{ price?.listPrice?.price }} $
    <!-- old price before discount -->
  </div>
  <div v-if="totalPrice">
    {{ totalPrice }} $
    <!-- actual price after discount -->
  </div>
</template>
