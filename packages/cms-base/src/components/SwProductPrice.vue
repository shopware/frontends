<script setup lang="ts">
import { useProductPrice } from "@shopware-pwa/composables-next";
import { Product } from "@shopware-pwa/types";

const props = defineProps<{
  product: Product;
}>();

const { originalPrice, price, showOriginalPrice } = useProductPrice(
  props.product
);
</script>

<template>
  <div>
    <SharedPrice
      v-if="showOriginalPrice && originalPrice"
      class="text-1xl text-gray-900 basis-2/6 justify-end line-through"
      :value="originalPrice"
    />
    <SharedPrice
      v-if="price"
      class="text-3xl text-gray-900 basis-2/6 justify-end"
      :class="{
        'text-red': showOriginalPrice,
      }"
      :value="price"
    />
  </div>
</template>
