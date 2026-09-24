<!-- Product.vue -->
<script setup lang="ts">
const product = searchProduct();
</script>
<template>
  <div>
    <ProductConfigurator :product="product" />
  </div>
</template>
