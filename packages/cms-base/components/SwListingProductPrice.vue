<script setup lang="ts">
import { useProductPrice } from "@shopware-pwa/composables-next";
import { Product } from "@shopware-pwa/types";

const props = defineProps<{
  product: Product;
}>();
const { product } = toRefs(props);

const { price, unitPrice, displayFromVariants, displayFrom, isListPrice } =
  useProductPrice(product);
const regulationPrice = computed(() => price.value?.regulationPrice?.price)

</script>

<template>
  <div :id="product.id">
    <SharedPrice
      v-if="isListPrice"
      class="text-xs text-gray-900 basis-2/6 justify-end line-through"
      :value="price?.listPrice?.price"
    />
    <SharedPrice
      class="text-sm text-gray-900 basis-2/6 justify-end"
      v-if="displayFromVariants"
      :value="displayFromVariants"
    >
      <template #beforePrice
        ><span v-if="displayFromVariants">variants from</span></template
      >
    </SharedPrice>
    <SharedPrice
      class="text-sm text-gray-900 basis-2/6 justify-end"
      :class="{
        'text-red': isListPrice,
      }"
      :value="unitPrice"
    >
      <template #beforePrice
        ><span v-if="displayFrom || displayFromVariants">to</span></template
      >
    </SharedPrice>
    <div class="text-xs flex text-gray-500" v-if="regulationPrice">
      Previously <SharedPrice class="ml-1" :value="regulationPrice"/>
    </div>
  </div>
</template>
