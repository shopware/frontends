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
      class="text-sm text-dark-primary font-normal basis-2/6 justify-start"
      v-if="displayFromVariants"
      :value="displayFromVariants"
    >
      <template #beforePrice
        ><span v-if="displayFromVariants">variants from</span></template
      >
    </SharedPrice>
    <SharedPrice
      class="text-sm text-dark-primary font-normal basis-2/6 justify-start"
      :value="unitPrice"
    >
      <template #beforePrice
        ><span v-if="displayFrom || displayFromVariants">from</span>
      </template>
    </SharedPrice>
  </div>
</template>
