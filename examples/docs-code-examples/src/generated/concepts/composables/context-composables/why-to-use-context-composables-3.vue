<!-- ProductPrice.vue -->
<script setup lang="ts">
const props = defineProps<{
  product: Product;
}>();
</script>
<template>
  <div>
    {{ getFormattedPrice(product.price) }}
  </div>
</template>
