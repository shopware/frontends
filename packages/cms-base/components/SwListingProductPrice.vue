<script setup lang="ts">
import { useProductPrice } from "@shopware-pwa/composables-next";
import { Product } from "@shopware-pwa/types";
import deepMerge from '../helpers/deepMerge'
import getTranslations from "../helpers/getTranslations";

const props =
  defineProps<{
    product: Product;
  }>();

type Translations = {
  listing: {
    variantsFrom: string
    previously: string
    to: string
  }
}

let translations: Translations = {
  listing: {
    variantsFrom: "variants from",
    previously: "Previously",
    to: "to"
  }
}

const globalTranslations = getTranslations()
translations = deepMerge(translations, globalTranslations) as Translations


const { product } = toRefs(props);

const { price, unitPrice, displayFromVariants, displayFrom, isListPrice } =
  useProductPrice(product);
const regulationPrice = computed(() => price.value?.regulationPrice?.price);
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
        ><span v-if="displayFromVariants">{{translations.listing.variantsFrom}}</span></template
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
        ><span v-if="displayFrom || displayFromVariants">{{translations.listing.to}}</span></template
      >
    </SharedPrice>
    <div class="text-xs flex text-gray-500" v-if="regulationPrice">
      {{translations.listing.previously}} <SharedPrice class="ml-1" :value="regulationPrice"/>
    </div>
  </div>
</template>
