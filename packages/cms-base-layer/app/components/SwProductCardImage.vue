<script setup lang="ts">
import {
  type UrlRouteOutput,
  getSmallestThumbnailUrl,
  isProductOnSale,
  isProductTopSeller,
} from "@shopware/helpers";
import { useElementSize } from "@vueuse/core";
import { computed, useTemplateRef } from "vue";
import type { Schemas } from "#shopware";

type Translations = {
  product: {
    badges: {
      topseller: string;
    };
  };
};

const props = defineProps<{
  product: Schemas["Product"];
  translations: Translations;
  isInWishlist: boolean;
  isLoading: boolean;
  toggleWishlist: () => Promise<void>;
  productLink: UrlRouteOutput;
}>();

const imageElement = useTemplateRef("imageElement");
const { height } = useElementSize(imageElement);

const DEFAULT_THUMBNAIL_SIZE = 10;
function roundUp(num: number) {
  return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE;
}

const coverSrcPath = computed(() => {
  return `${getSmallestThumbnailUrl(props.product?.cover?.media)}?&height=${roundUp(
    height.value,
  )}&fit=cover`;
});

const coverAlt = computed(() => {
  return props.product?.cover?.media?.alt || props.product?.translated?.name;
});

const isOnSale = computed(() => isProductOnSale(props.product));
const isTopseller = computed(() => isProductTopSeller(props.product));
</script>

<template>
  <div class="relative flex h-80 flex-col items-start justify-start self-stretch overflow-hidden">
    <RouterLink :to="productLink" class="relative h-80 self-stretch overflow-hidden">
      <img ref="imageElement" class="absolute top-[-1px] left-[-0.98px] w-full h-full object-cover"
        :src="coverSrcPath" :alt="coverAlt" data-testid="product-box-img" />
    </RouterLink>

    <div v-if="isTopseller || isOnSale"
      class="absolute top-[281px] left-[8px] inline-flex items-center justify-center rounded bg-states-error px-1.5 py-1"
      data-state="default" data-type="error">
      <div class="justify-start font-['Inter'] text-xs font-bold leading-none text-states-on-error">
        {{ translations.product.badges.topseller }}
      </div>
    </div>

    <client-only>
      <SwIconButton type="secondary" aria-label="Toggle wishlist" :disabled="isLoading"
        class=" bg-brand-secondary absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full"
        data-testid="product-box-toggle-wishlist-button" @click="toggleWishlist">
        <SwWishlistIcon :filled="isInWishlist" />
      </SwIconButton>
    </client-only>
  </div>
</template>