<script setup lang="ts">
import { useProductPrice } from "@shopware-pwa/composables-next";
import { Product } from "@shopware-pwa/types";

const props = defineProps<{
  product: Product;
}>();
const { product } = toRefs(props);

const { originalPrice, price, showOriginalPrice, fromPrice } =
  useProductPrice(product);
</script>

<template>
  <div>
    <template v-if="!fromPrice">
      <SharedPrice
        v-if="showOriginalPrice && originalPrice"
        class="text-sm text-gray-900 basis-2/6 justify-end line-through"
        :value="originalPrice"
      />
      <SharedPrice
        v-if="price"
        class="text-m text-gray-900 basis-2/6 justify-end"
        :class="{
          'text-red': showOriginalPrice,
        }"
        :value="price"
      />
    </template>
    <template v-else>
      <SharedPrice
        v-if="showOriginalPrice && fromPrice"
        class="text-sm text-gray-900 basis-2/6 justify-end line-through"
        :value="fromPrice"
      >
        <template #beforePrice> From </template>
      </SharedPrice>
    </template>
  </div>
</template>
