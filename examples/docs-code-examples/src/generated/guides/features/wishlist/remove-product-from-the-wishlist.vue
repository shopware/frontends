<script setup lang="ts">
// Mocked product
const product: Product = {
  id: "7b5b97bd48454979b14f21c8ef38ce08",
};
const { removeFromWishlist, isInWishlist } = useProductWishlist(product);
</script>

<template>
  <button v-if="isInWishlist" @click="removeFromWishlist">
    Remove product from the wishlist
  </button>
</template>
