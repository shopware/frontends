<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useProductSearch } from "@shopware-pwa/composables-next/dist";
import type { Product } from "@shopware-pwa/types";
import ProductView from "@/components/ProductView.vue";

const { search } = useProductSearch();

const product = ref<Product>();
onMounted(async () => {
  const productResponse = await search("b2e974a54f8a48949a6397c72d2bffb5", {
    criteria: {
      associations: {
        properties: {},
        options: {
          associations: {
            group: {},
          },
        },
        manufacturer: {},
      },
    },
  });
  product.value = productResponse.product;
});
</script>
<template>
  <div test-id="test-wrapper">
    <Transition mode="out-in">
      <ProductView v-if="product" :product="product" />
    </Transition>
  </div>
</template>
<style>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
