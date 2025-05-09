<script setup lang="ts">
import { useCmsTranslations, useProductPrice } from "@shopware/composables";
import { defu } from "defu";
import { toRefs } from "vue";
import type { Schemas } from "#shopware";

const props = defineProps<{
  product: Schemas["Product"];
}>();

type Translations = {
  listing: {
    variantsFrom: string;
    previously: string;
    from: string;
    to: string;
  };
};

let translations: Translations = {
  listing: {
    variantsFrom: "variants from",
    previously: "previously",
    from: "from",
    to: "to",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const { product } = toRefs(props);

const {
  price,
  unitPrice,
  displayFromVariants,
  displayFrom,
  isListPrice,
  regulationPrice,
} = useProductPrice(product);
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
      v-if="displayFromVariants"
      class="text-xl text-gray-900 basis-2/6 justify-end"
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
          translations.listing.from
        }}</span></template
      >
    </SwSharedPrice>
    <template v-if="regulationPrice">
      <div class="flex gap-2 justify-end text-gray-500 text-3.5 mb-2">
        {{ translations.listing.previously }}
        <SwSharedPrice :value="regulationPrice" />
      </div>
    </template>
    <template v-if="!regulationPrice">
      <div class="h-7"><!-- placeholder --></div>
    </template>
  </div>
</template>
