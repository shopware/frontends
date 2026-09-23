<!-- ProductConfigurator.vue -->
<script setup lang="ts">
const props = defineProps<{
  product: Product;
}>();
</script>
<template>
  <div>
    <ProductPrice :product="product" />
  </div>
</template>
