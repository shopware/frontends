<template>
  <button 
    class="w-full py-6 bg-brand-primary hover:bg-brand-primary/90 text-states-on-info rounded"
    @click="addToCart"
  >
    Add to cart
  </button>
</template>

<script setup>
// Methods
const addToCart = () => {
  // Here you would implement the logic to add the product to the cart
  console.log("Product added to cart");
};
</script>