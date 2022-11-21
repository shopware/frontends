<script setup lang="ts">
import { useProductPrice } from "@shopware-pwa/composables-next";
import { Product } from "@shopware-pwa/types";

const props = defineProps<{
  product: Product;
}>();
const { product } = toRefs(props);

const { unitPrice, displayFromVariants, displayFrom } =
  useProductPrice(product);
</script>

<template>
  <div :id="product.id">
    <SharedPrice
      class="text-xs text-gray-900 basis-2/6 justify-end"
      v-if="displayFromVariants"
      :value="displayFromVariants"
    >
      <template #beforePrice
        ><span v-if="displayFromVariants">variants from</span></template
      >
    </SharedPrice>
    <SharedPrice
      class="text-sm text-gray-900 basis-2/6 justify-end"
      :value="unitPrice"
    >
      <template #beforePrice><span v-if="displayFrom">from</span></template>
    </SharedPrice>
  </div>
</template>
