<script setup lang="ts">
import { getSmallestThumbnailUrl } from "@shopware/helpers";
import type { Schemas } from "#shopware";

const { product } = defineProps<{
  product: Schemas["Product"];
}>();

const { addProduct } = useCart();
</script>
<template>
  <div>
    <NuxtImg
      :src="getSmallestThumbnailUrl(product.cover?.media)"
      :alt="`${product.name} cart item`"
      class="object-cover object-center"
      width="151"
      height="151"
    />
    <div>
      <h3>{{ product.name }}</h3>
    </div>
    <SharedPrice :value="product.calculatedPrice?.totalPrice" />
    <FormBaseButton
      :label="$t('product.addToCart')"
      @click="addProduct({ id: product.id })"
    />
  </div>
</template>
