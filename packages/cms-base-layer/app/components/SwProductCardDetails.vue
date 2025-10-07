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
  <div class="self-stretch p-2 flex flex-col justify-between items-start gap-4 flex-1">
    <div class="self-stretch flex flex-col justify-start items-start gap-4">
      <div class="self-stretch flex flex-col justify-start items-start gap-2">
        <div class="self-stretch flex flex-col justify-start items-start gap-1 min-h-24">
          <div v-if="productManufacturer"
            class="self-stretch justify-start text-surface-on-surface text-sm font-bold font-['Inter'] leading-tight">
            {{ productManufacturer }}
          </div>

          <RouterLink :to="productLink"
            class="self-stretch justify-start text-surface-on-surface text-2xl font-normal font-['Noto_Serif'] leading-9 overflow-hidden line-clamp-2 break-words"
            data-testid="product-box-product-name-link">
            {{ productName }}
          </RouterLink>
        </div>
      </div>

      <SwListingProductPrice :product="product" data-testid="product-box-product-price" />
    </div>

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