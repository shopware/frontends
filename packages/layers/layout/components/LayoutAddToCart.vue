<template>
  <button 
    class="self-stretch px-4 py-3 w-full bg-brand-primary hover:bg-brand-primary/90 text-states-on-info rounded inline-flex justify-center items-center gap-1"
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