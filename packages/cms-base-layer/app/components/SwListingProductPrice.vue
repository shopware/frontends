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
  <div :id="product.id" class="inline-flex justify-start items-center gap-2">
    <!-- Sale price display -->
    <div v-if="isListPrice" class="flex items-center gap-2">
      <div class="text-base font-bold leading-normal">
        <SwSharedPrice :value="unitPrice">
          <template #beforePrice>
            <span v-if="displayFrom || displayFromVariants" class="text-sm">{{
              translations.listing.from
            }}</span>
          </template>
        </SwSharedPrice>
      </div>
      <div class="text-surface-on-surface-variant text-sm font-normal leading-tight line-through">
        <SwSharedPrice :value="price?.listPrice?.price" />
      </div>
    </div>

    <!-- Regular price display -->
    <div v-else class="text-surface-on-surface text-base font-bold leading-normal">
      <SwSharedPrice :value="unitPrice">
        <template #beforePrice>
          <span v-if="displayFrom || displayFromVariants" class="text-sm">{{
            translations.listing.from
          }}</span>
        </template>
      </SwSharedPrice>
    </div>

    <!-- Variants from price -->
    <div v-if="displayFromVariants" class="text-surface-on-surface text-base font-bold leading-normal">
      <SwSharedPrice :value="displayFromVariants">
        <template #beforePrice>
          <span v-if="displayFromVariants" class="text-sm">{{
            translations.listing.variantsFrom
          }}</span>
        </template>
      </SwSharedPrice>
    </div>

    <!-- Regulation price -->
    <div v-if="regulationPrice" class="flex gap-2 text-surface-on-surface-variant text-sm">
      {{ translations.listing.previously }}
      <SwSharedPrice :value="regulationPrice" />
    </div>
  </div>
</template>
