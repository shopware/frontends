<!-- ProductConfigurator.vue -->
<script setup lang="ts">
import type { Schemas } from "#shopware";

type Product = Schemas["Product"];

const props = defineProps<{
  product: Product;
}>();
</script>
<template>
  <div>
    <ProductPrice :product="product" />
  </div>
</template>
