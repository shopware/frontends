<script setup lang="ts">
import type { Schemas } from "#shopware";

const { product, showContent = true } = defineProps<{
  product: Schemas["Product"];
  showContent?: boolean;
}>();

const purchaseUnit = computed(() => product?.purchaseUnit);
const unitName = computed(() => product?.unit?.translated.name);
const referencePrice = computed(
  () => product?.calculatedPrice?.referencePrice?.price,
);
const referenceUnit = computed(
  () => product?.calculatedPrice?.referencePrice?.referenceUnit,
);
const referenceUnitName = computed(
  () => product?.calculatedPrice?.referencePrice?.unitName,
);
</script>

<template>
  <div v-if="purchaseUnit" class="flex text-secondary-500 justify-end gap-1">
    <template v-if="showContent">
      {{ $t("product.content") }}: {{ purchaseUnit }} {{ unitName }}
    </template>
    <template v-if="referencePrice">
      ( <SharedPrice :value="referencePrice" /> / {{ referenceUnit }}
      {{ referenceUnitName }} )
    </template>
  </div>
</template>
