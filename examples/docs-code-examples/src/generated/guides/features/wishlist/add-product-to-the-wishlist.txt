<script setup lang="ts">
import { useProductWishlist } from "#imports";
// Mocked product
const product: Schemas["Product"] = {
  id: "7b5b97bd48454979b14f21c8ef38ce08",
};
const { addToWishlist, isInWishlist } = useProductWishlist(product);
</script>

<template>
  <button v-if="!isInWishlist" @click="addToWishlist">
    Add product to wishlist
  </button>
</template>
