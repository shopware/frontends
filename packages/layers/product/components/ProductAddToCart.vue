<script setup lang="ts">
import type { Schemas } from "@shopware/api-client/store-api-types";
import { useAddToCart } from "@shopware/composables";
import { ref } from "vue";

const props = defineProps<{
  product: Schemas["Product"];
  quantity: number;
  selectedOptions?: string[];
}>();

const isLoading = ref(false);
const { addToCart: addItemToCart } = useAddToCart(props.product);
const { openCart } = useCartSidebar();

const addToCart = async () => {
  isLoading.value = true;
  try {
    await addItemToCart();

    // Open the cart sidebar after successfully adding the product
    openCart();
  } catch (error) {
    console.error("Failed to add product to cart:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <button 
    class="self-stretch px-4 py-3 w-full bg-brand-primary hover:bg-brand-primary/90 text-states-on-info rounded inline-flex justify-center items-center gap-1"
    @click="addToCart"
    :disabled="isLoading"
  >
    <span v-if="isLoading" class="inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
    {{ isLoading ? 'Adding...' : 'Add to cart' }}
  </button>
</template>