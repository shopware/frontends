<script setup lang="ts">
import type { BoxLayout } from "@shopware/composables";
import type { UrlRouteOutput } from "@shopware/helpers";
import { computed } from "vue";
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

const props = defineProps<{
  product: Schemas["Product"];
  productName: string | null;
  productManufacturer?: string | null;
  translations: Translations;
  fromPrice?: number;
  addToCartProxy: () => Promise<void>;
  productLink: UrlRouteOutput;
  layoutType?: BoxLayout;
}>();

const isMinimalLayout = computed(() => props.layoutType === "minimal");
</script>
<template>
  <div class="self-stretch p-2 flex flex-col justify-between items-start gap-4 flex-1">
    <div class="self-stretch flex flex-col justify-start items-start gap-4">
      <div class="self-stretch flex flex-col justify-start items-start gap-2">
        <div class="self-stretch flex flex-col justify-start items-start gap-1">
          <div v-if="productManufacturer"
            class="self-stretch text-surface-on-surface text-sm font-bold leading-tight">
            {{ productManufacturer }}
          </div>

          <RouterLink :to="productLink"
            class="self-stretch text-surface-on-surface text-2xl font-normal font-serif leading-9 overflow-hidden line-clamp-2 break-words"
            data-testid="product-box-product-name-link">
            {{ productName }}
          </RouterLink>
        </div>
      </div>

      <!-- Star rating for minimal layout -->
      <SwProductRating
        v-if="isMinimalLayout"
        :rating="product?.ratingAverage ?? 0"
        :review-count="product?.productReviews?.length ?? 0"
      />

      <!-- Price for standard layout -->
      <SwListingProductPrice v-else :product="product" data-testid="product-box-product-price" />
    </div>

    <!-- CTA buttons only for non-minimal layout -->
    <template v-if="!isMinimalLayout">
      <SwBaseButton variant="primary" v-if="!fromPrice" size="medium" :disabled="!product?.available" block
        data-testid="add-to-cart-button" @click="addToCartProxy">
        {{ translations.product.addToCart }}
      </SwBaseButton>

      <RouterLink v-else :to="productLink" class="self-stretch">
        <SwBaseButton block>
          {{ translations.product.details }}
        </SwBaseButton>
      </RouterLink>
    </template>
  </div>
</template>