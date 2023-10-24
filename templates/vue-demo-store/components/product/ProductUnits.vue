<script setup lang="ts">
import type { Product } from "@shopware-pwa/types";

const props = withDefaults(
  defineProps<{
    product: Product;
    showContent?: boolean;
  }>(),
  {
    showContent: true,
  },
);

const purchaseUnit = computed(() => props.product?.purchaseUnit);
const unitName = computed(() => props.product?.unit?.translated?.name);
const referencePrice = computed(
  () => props.product?.calculatedPrice?.referencePrice?.price,
);
const referenceUnit = computed(
  () => props.product?.calculatedPrice?.referencePrice?.referenceUnit,
);
const referenceUnitName = computed(
  () => props.product?.calculatedPrice?.referencePrice?.unitName,
);
</script>

<template>
  <div v-if="purchaseUnit" class="flex text-gray-500 justify-end gap-1">
    <template v-if="props.showContent">
      {{ $t("product.content") }}: {{ purchaseUnit }} {{ unitName }}
    </template>
    <template v-if="referencePrice">
      ( <SharedPrice :value="referencePrice" /> / {{ referenceUnit }}
      {{ referenceUnitName }} )
    </template>
  </div>
</template>
