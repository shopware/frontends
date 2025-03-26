<script setup lang="ts">
import type { Schemas } from "@shopware/api-client/store-api-types";

const props = defineProps<{
  title?: string;
  description?: string;
  crossSelling: Schemas["CrossSellingElement"];
}>();

const crossSellingProducts = computed(() => {
  return props.crossSelling.products;
});

const title = ref(props.title || props.crossSelling.crossSelling.name);
</script>
<template>
  <div v-if="crossSellingProducts.length > 0" class="container mx-auto py-18 px-4">
    <h1 class="text-center text-scale-07 font-serif mb-10 text-surface-on-surface">
      {{ title || "Related Products" }}
    </h1>
    <!-- <p v-if="description" class="text-center max-w-3xl mx-auto mb-10 text-scale-03 text-outline-outline">
      {{ description }}
    </p> -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard class="transition-transform duration-300 hover:scale-105" v-for="product in crossSellingProducts" :key="product.id" :product="product" />
    </div>

  </div>
</template>