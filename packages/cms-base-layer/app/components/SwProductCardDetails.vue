<script setup lang="ts">
import type { UrlRouteOutput } from "@shopware/helpers";
import type { Schemas } from "#shopware";

type Translations = {
  product: {
    addToCart: string;
    details: string;
  };
  errors: {
    [key: string]: string;
  };
};

defineProps<{
  product: Schemas["Product"];
  productName: string | null;
  productManufacturer?: string | null;
  translations: Translations;
  fromPrice?: number;
  addToCartProxy: () => Promise<void>;
  productLink: UrlRouteOutput;
}>();
</script>
<template>
  <div class="flex flex-col items-start justify-start gap-4 self-stretch p-2">
    <div class="flex flex-col items-start justify-start gap-2 self-stretch flex-1">
      <div class="flex flex-col items-start justify-start gap-1 self-stretch">
        <div v-if="productManufacturer"
          class="text-surface-on-surface justify-start self-stretch font-['Inter'] text-sm font-bold leading-tight min-h-[1.25rem]">
          {{ productManufacturer }}
        </div>

        <RouterLink :to="productLink"
          class="text-surface-on-surface justify-start self-stretch font-['Noto_Serif'] text-2xl font-normal leading-9 h-[4.5] overflow-hidden line-clamp-2 display-webkit-box"
          style="-webkit-box-orient: vertical;" data-testid="product-box-product-name-link">
          {{ productName }}
        </RouterLink>
      </div>
    </div>

    <SwListingProductPrice :product="product" class="" data-testid="product-box-product-price" />

    <SwBaseButton variant="primary" v-if="!fromPrice" size="medium" :disabled="!product?.available" block
      data-testid="add-to-cart-button" @click="addToCartProxy">
      {{ translations.product.addToCart }}
    </SwBaseButton>

    <RouterLink v-else :to="productLink" class="self-stretch">
      <SwBaseButton block>
        {{ translations.product.details }}
      </SwBaseButton>
    </RouterLink>
  </div>
</template>