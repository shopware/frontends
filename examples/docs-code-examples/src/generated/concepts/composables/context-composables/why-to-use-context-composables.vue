<!-- Product.vue -->
<script setup lang="ts">
import type { Schemas } from "#shopware";

const product = searchProduct();

function searchProduct(): Schemas["Product"] {
  return {} as Schemas["Product"];
}
</script>
<template>
  <div>
    <ProductConfigurator :product="product" />
  </div>
</template>
