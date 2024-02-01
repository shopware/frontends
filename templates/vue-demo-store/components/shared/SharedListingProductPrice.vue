<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  product: Schemas["Product"];
}>();
const { product } = toRefs(props);

const { unitPrice, displayFromVariants, displayFrom } =
  useProductPrice(product);
</script>

<template>
  <div :id="product.id">
    <SharedPrice
      v-if="displayFromVariants"
      class="text-xs text-secondary-900 basis-2/6 justify-end"
      :value="displayFromVariants"
    >
      <template #beforePrice>
        <span v-if="displayFromVariants">{{ $t("product.variantsFrom") }}</span>
      </template>
    </SharedPrice>
    <SharedPrice
      class="text-sm text-secondary-900 basis-2/6 justify-end"
      :value="unitPrice"
    >
      <template #beforePrice>
        <span v-if="displayFrom">{{ $t("product.price.from") }}</span>
      </template>
    </SharedPrice>
  </div>
</template>
