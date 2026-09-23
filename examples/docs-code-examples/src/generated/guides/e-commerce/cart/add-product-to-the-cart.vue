<script setup lang="ts">
const product: Product = {
  id: "7b5b97bd48454979b14f21c8ef38ce08",
};
const { addProduct, quantity, getAvailableStock } = useAddToCart({
  product,
});
</script>
<template>
  Only {{ getAvailableStock }} in stock<br />
  <input v-model="quantity" type="number" />
  <button @click="addToCart()">Add to cart</button>
</template>
