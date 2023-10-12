<script setup lang="ts">
import { Product } from "@shopware-pwa/types";
import deepMerge from "../helpers/deepMerge";
import getTranslations from "../helpers/getTranslations";
import SwSharedPrice from "./SwSharedPrice.vue";

const props = defineProps<{
  product: Product;
}>();

type Translations = {
  listing: {
    variantsFrom: string;
    previously: string;
    to: string;
  };
};

let translations: Translations = {
  listing: {
    variantsFrom: "variants from",
    previously: "Previously",
    to: "to",
  },
};

const globalTranslations = getTranslations();
translations = deepMerge(translations, globalTranslations) as Translations;

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
    <template v-if="!isListPrice">
      <div class="h-6"><!-- placeholder --></div>
    </template>
    <SwSharedPrice
      class="text-xl text-gray-900 basis-2/6 justify-end"
      v-if="displayFromVariants"
      :value="displayFromVariants"
    >
      <template #beforePrice
        ><span v-if="displayFromVariants" class="text-sm">{{
          translations.listing.variantsFrom
        }}</span></template
      >
    </SwSharedPrice>
    <SwSharedPrice
      class="text-gray-900 basis-2/6"
      :class="{
        'text-red-600 font-bold': isListPrice,
        'justify-end text-xl':
          regulationPrice || !regulationPrice || !displayFromVariants,
      }"
      :value="unitPrice"
    >
      <template #beforePrice
        ><span v-if="displayFrom || displayFromVariants" class="text-sm">{{
          translations.listing.to
        }}</span></template
      >
    </SwSharedPrice>
    <template v-if="regulationPrice">
      <div class="text-xs flex text-gray-500">
        {{ translations.listing.previously }}
        <SharedPrice class="ml-1" :value="regulationPrice" />
      </div>
    </template>
    <template v-if="!regulationPrice">
      <div class="h-4"><!-- placeholder --></div>
    </template>
  </div>
</template>
