<script setup lang="ts">
import { useProductWishlist } from "#imports";

// Mocked product
const product = {
  id: "7b5b97bd48454979b14f21c8ef38ce08",
};
const { addToWishlist, isInWishlist } = useProductWishlist(product.id);
</script>

<template>
  <button v-if="!isInWishlist" @click="addToWishlist">
    Add product to wishlist
  </button>
</template>
