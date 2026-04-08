<script setup lang="ts">
import {
  type UrlRouteOutput,
  getSmallestThumbnailUrl,
  isProductOnSale,
  isProductTopSeller,
} from "@shopware/helpers";
import { useElementSize } from "@vueuse/core";
import { computed, useTemplateRef } from "vue";
import { useImagePlaceholder } from "#imports";
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

const containerElement = useTemplateRef<HTMLDivElement>("containerElement");
const { width, height } = useElementSize(containerElement);

const DEFAULT_THUMBNAIL_SIZE = 10;
function roundUp(num: number) {
  return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE;
}

const coverSrcPath = computed(() => {
  return (
    getSmallestThumbnailUrl(props.product?.cover?.media) ||
    props.product?.cover?.media?.url
  );
});

const imageModifiers = computed(() => {
  // Use the larger dimension and apply 2x for high-DPI displays
  // For square containers, width and height should be the same
  const containerSize = Math.max(width.value || 0, height.value || 0);
  const size = roundUp(containerSize * 2);
  return {
    width: size,
    height: size,
  };
});

const coverAlt = computed(() => {
  return props.product?.cover?.media?.alt || props.product?.translated?.name;
});

const isOnSale = computed(() => isProductOnSale(props.product));
const isTopseller = computed(() => isProductTopSeller(props.product));

const placeholderSvg = useImagePlaceholder();
</script>

<template>
  <div ref="containerElement" class="self-stretch min-h-[350px] relative flex flex-col justify-start items-start overflow-hidden aspect-square">
    <RouterLink :to="productLink" class="self-stretch h-full relative overflow-hidden">
      <NuxtImg preset="productCard"
        class="w-full h-full absolute top-0 left-0 object-cover"
        :placeholder="placeholderSvg"
        :src="coverSrcPath" :alt="coverAlt" :modifiers="imageModifiers" data-testid="product-box-img" />
    </RouterLink>

    <div v-if="isTopseller || isOnSale"
      class="px-1.5 py-1 left-2 bottom-2 absolute bg-other-sale rounded inline-flex justify-center items-center">
      <div class="text-states-on-error text-xs font-bold leading-none">
        {{ translations.product.badges.topseller }}
      </div>
    </div>

    <client-only>
      <SwIconButton type="secondary" aria-label="Toggle wishlist" :disabled="isLoading"
        class="w-10 h-10 right-4 top-4 absolute bg-brand-secondary rounded-full flex items-center justify-center"
        data-testid="product-box-toggle-wishlist-button" @click="toggleWishlist">
        <SwWishlistIcon :filled="isInWishlist" />
      </SwIconButton>
    </client-only>
  </div>
</template>