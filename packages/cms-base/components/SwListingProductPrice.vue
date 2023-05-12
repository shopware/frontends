<script setup lang="ts">
import { useProductPrice } from "@shopware-pwa/composables-next";
import { Product } from "@shopware-pwa/types";
import SwSharedPrice from "./SwSharedPrice.vue";

const props = defineProps<{
  product: Product;
}>();
const { product } = toRefs(props);

const { price, unitPrice, displayFromVariants, displayFrom, isListPrice } =
  useProductPrice(product);
const regulationPrice = computed(() => price.value?.regulationPrice?.price);
</script>

<template>
  <div :id="product.id">
    <SwSharedPrice
      v-if="isListPrice"
      class="text-l text-gray-900 basis-2/6 justify-end line-through"
      :value="price?.listPrice?.price"
    />
    <SwSharedPrice
      class="text-xl text-gray-900 basis-2/6 justify-end"
      v-if="displayFromVariants"
      :value="displayFromVariants"
    >
      <template #beforePrice
        ><span v-if="displayFromVariants" class="text-sm">from</span></template
      >
    </SwSharedPrice>
    <SwSharedPrice
      class="text-gray-900 basis-2/6"
      :class="{
        'text-red-600 font-bold': isListPrice,
        'justify-start text-xl': regulationPrice || !displayFromVariants,
        'justify-end text-l': !regulationPrice,
      }"
      :value="unitPrice"
    >
      <template #beforePrice
        ><span v-if="displayFrom || displayFromVariants" class="text-sm"
          >to</span
        ></template
      >
    </SwSharedPrice>
    <div class="text-xs flex text-gray-500" v-if="regulationPrice">
      Previously <SwSharedPrice class="ml-1" :value="regulationPrice" />
    </div>
  </div>
</template>
