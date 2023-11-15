<script setup lang="ts">
import { RouterLink } from "vue-router";
import type {
  BoxLayout,
  DisplayMode,
} from "@shopware-pwa/composables-next/composables";
import {
  getProductName,
  getProductRoute,
  getProductFromPrice,
  getSmallestThumbnailUrl,
} from "@shopware-pwa/helpers-next";
import type { ClientApiError, Product } from "@shopware-pwa/types";
import { toRefs, type Ref, computed, ref } from "vue";
import SwListingProductPrice from "./SwListingProductPrice.vue";
import deepMerge from "../helpers/deepMerge";
import getTranslations from "../helpers/getTranslations";
import getUrlPrefix from "../helpers/getUrlPrefix";
import buildUrlPrefix from "../helpers/buildUrlPrefix";
import { useAddToCart, useNotifications, useProductWishlist } from "#imports";
import { useElementSize } from "@vueuse/core";

const { pushSuccess, pushError } = useNotifications();

const props = withDefaults(
  defineProps<{
    product: Product;
    layoutType?: BoxLayout;
    isProductListing?: boolean;
    displayMode?: DisplayMode;
  }>(),
  {
    layoutType: "standard",
    displayMode: "standard",
    isProductListing: false,
  },
);

type Translations = {
  product: {
    addedToWishlist: string;
    reason: string;
    cannotAddToWishlist: string;
    addedToCart: string;
    addToCart: string;
    details: string;
  };
};

let translations: Translations = {
  product: {
    addedToWishlist: "has been added to wishlist.",
    reason: "Reason",
    cannotAddToWishlist: "cannot be added to wishlist.",
    addedToCart: "has been added to cart.",
    addToCart: "Add to cart",
    details: "Details",
  },
};

const globalTranslations = getTranslations();
translations = deepMerge(translations, globalTranslations) as Translations;

const { product } = toRefs(props);

const { addToCart, isInCart, count } = useAddToCart(product);

const { addToWishlist, removeFromWishlist, isInWishlist } =
  useProductWishlist(product);

const toggleWishlistProduct = async () => {
  if (!isInWishlist.value) {
    try {
      await addToWishlist();
      return pushSuccess(
        `${props.product?.translated?.name} ${translations.product.addedToWishlist}`,
      );
    } catch (error) {
      const e = error as ClientApiError;
      const reason = e?.messages?.[0]?.detail
        ? `${translations.product.reason}: ${e?.messages?.[0]?.detail}`
        : "";
      return pushError(
        `${props.product?.translated?.name} ${translations.product.cannotAddToWishlist}\n${reason}`,
        {
          timeout: 5000,
        },
      );
    }
  }
  removeFromWishlist();
};

const addToCartProxy = async () => {
  await addToCart();
  pushSuccess(
    `${props.product?.translated?.name} ${translations.product.addedToCart}`,
  );
};

const fromPrice = getProductFromPrice(props.product);
const urlPrefix = getUrlPrefix();
const ratingAverage: Ref<number> = computed(() =>
  props.product.ratingAverage ? Math.round(props.product.ratingAverage) : 0,
);

const imageElement = ref(null);
const { height } = useElementSize(imageElement);

const DEFAULT_THUMBNAIL_SIZE = 10;
function roundUp(num: number) {
  return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE;
}

const srcPath = computed(() => {
  return `${getSmallestThumbnailUrl(
    product.value?.cover?.media as any, // TODO: [OpenAPI][ProductMedia] - add thumbnails definition to schema
  )}?&height=${roundUp(height.value)}&fit=crop`;
});
</script>

<template>
  <div
    class="sw-product-card group relative max-w-full inline-block max-w-sm bg-white border border-gray-200 rounded-md shadow transform transition duration-300 hover:scale-101"
    data-testid="product-box"
  >
    <div
      :class="[
        'w-full rounded-md overflow-hidden hover:opacity-75',
        layoutType === 'image' ? 'h-80' : 'h-60',
      ]"
    >
      <RouterLink
        :to="buildUrlPrefix(getProductRoute(product), urlPrefix)"
        class="overflow-hidden"
      >
        <img
          ref="imageElement"
          loading="lazy"
          :src="srcPath"
          :alt="getProductName({ product }) || ''"
          class="transform transition duration-400 hover:scale-120"
          :class="{
            'w-full h-full': true,
            'object-cover':
              displayMode === 'cover' ||
              (displayMode === 'standard' && layoutType === 'image'),
            'object-contain': displayMode === 'contain',
            'object-scale-down':
              displayMode === 'standard' && layoutType !== 'image',
          }"
          data-testid="product-box-img"
        />
      </RouterLink>
    </div>
    <button
      aria-label="Add to wishlist"
      type="button"
      @click="toggleWishlistProduct"
      class="absolute bg-transparent top-2 right-2 hover:animate-count-infinite hover:animate-heart-beat"
      data-testid="product-box-toggle-wishlist-button"
    >
      <client-only>
        <div
          v-if="isInWishlist"
          class="h-9 w-9 i-carbon-favorite-filled c-red-500"
          data-testid="product-box-wishlist-icon-in"
        ></div>
        <div
          v-else
          class="h-9 w-9 i-carbon-favorite c-black"
          data-testid="product-box-wishlist-icon-not-in"
        ></div>
        <template #placeholder>
          <div class="h-9 w-9 i-carbon-favorite"></div>
        </template>
      </client-only>
    </button>
    <div class="h-8 mx-4 my-2">
      <p
        v-for="option in product?.options"
        :key="option.id"
        class="items-center px-1 py-0 line-clamp-2 rounded-md bg-gray-50 ring-1 ring-inset ring-gray-500/10 text-xs font-medium text-gray-600"
      >
        {{ option.group.name }}:
        {{ option.name }}
      </p>
    </div>
    <div class="px-4 pb-4 h-52 md:h-32">
      <RouterLink
        class="line-clamp-2"
        :to="buildUrlPrefix(getProductRoute(product), urlPrefix)"
        data-testid="product-box-product-name-link"
      >
        <h5
          class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white min-h-60px"
        >
          {{ getProductName({ product }) }}
        </h5>
      </RouterLink>
      <div class="md:flex items-center justify-between">
        <div class="">
          <SwListingProductPrice
            :product="product"
            class="ml-auto"
            data-testid="product-box-product-price"
          />
        </div>

        <button
          v-if="!fromPrice"
          type="button"
          @click="addToCartProxy"
          class="justify-center w-full md:w-auto my-8 md-m-0 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transform transition duration-400 md:hover:scale-120 flex"
          :class="{
            'text-white bg-blue-600 hover:bg-blue-700': !isInCart,
            'text-gray-600 bg-gray-100': isInCart,
          }"
          data-testid="add-to-cart-button"
        >
          {{ translations.product.addToCart }}
          <div v-if="isInCart" class="flex ml-2">
            <div class="w-5 h-5 i-carbon-shopping-bag text-gray-600" />
            {{ count }}
          </div>
        </button>
        <RouterLink
          v-else
          :to="buildUrlPrefix(getProductRoute(product), urlPrefix)"
          class=""
        >
          <div
            class="justify-center w-full md:w-auto my-8 md-m-0 py-2 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transform transition duration-400 hover:scale-120"
          >
            <span data-testid="product-box-product-show-details">Details</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
