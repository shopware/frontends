<script setup lang="ts">
import { useCmsTranslations } from "@shopware/composables";
import { defu } from "defu";
import { computed } from "vue";
import type { Schemas } from "#shopware";

const { product, showContent = true } = defineProps<{
  product: Schemas["Product"];
  showContent?: boolean;
}>();

type Translations = {
  product: {
    content: string;
  };
};

let translations: Translations = {
  product: {
    content: "Content",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

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
  <div v-if="purchaseUnit" class="flex text-gray-500 justify-end gap-1">
    <template v-if="showContent">
      {{ translations.product.content }}: {{ purchaseUnit }} {{ unitName }}
    </template>
    <template v-if="referencePrice">
      (<SwSharedPrice :value="referencePrice" /> / {{ referenceUnit }}
      {{ referenceUnitName }} )
    </template>
  </div>
</template>
