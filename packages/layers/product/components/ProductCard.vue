<script setup lang="ts">
import type { Schemas } from "@shopware/api-client/store-api-types";

type Product = Schemas["Product"];

const props = defineProps<{
  product: Product;
}>();

const manufacturerName = computed(() => {
  return props.product.manufacturer?.name || "";
});

const productImage = computed(() => {
  if (props.product.cover?.media?.url) {
    return props.product.cover.media.url;
  }
  return "https://placehold.co/600x600";
});

const ratingAverage = computed(() => {
  return props.product.ratingAverage || 0;
});

const reviewCount = computed(() => {
  return props.product.productReviews || 0;
});
</script>
<template>
  <div class="flex flex-col">
    <div class="bg-surface-surface-variant mb-3">
      <img 
        :src="productImage" 
        :alt="product.name" 
        class="w-full h-auto aspect-square"
      />
    </div>
    <div class="space-y-1">
      <p class="text-scale-02 text-outline-outline">{{ manufacturerName }}</p>
      <h3 class="text-scale-03 font-medium text-surface-on-surface">{{ product.name }}</h3>
      <ProductStarRating 
        :rating="ratingAverage" 
        :reviews="reviewCount" 
      />
    </div>
  </div>
</template>