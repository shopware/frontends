<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { BoxLayout, DisplayMode } from "@shopware-pwa/composables-next";
import { useCmsTranslations } from "@shopware-pwa/composables-next";
import {
  buildUrlPrefix,
  getProductName,
  getProductRoute,
  getProductFromPrice,
  getSmallestThumbnailUrl,
} from "@shopware-pwa/helpers-next";
import { toRefs, computed, ref, useTemplateRef } from "vue";
import { defu } from "defu";
import {
  useAddToCart,
  useNotifications,
  useProductWishlist,
  useUrlResolver,
  useCartNotification,
  useCartErrorParamsResolver,
} from "#imports";
import { useElementSize } from "@vueuse/core";
import type { Schemas } from "#shopware";
import { ApiClientError } from "@shopware/api-client";
import { getCmsTranslate } from "@shopware-pwa/helpers-next";

const { pushSuccess, pushError } = useNotifications();
const { getErrorsCodes } = useCartNotification();
const { resolveCartError } = useCartErrorParamsResolver();

const props = withDefaults(
  defineProps<{
    product: Schemas["Product"];
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
    removedFromTheWishlist: string;
    reason: string;
    cannotAddToWishlist: string;
    addedToCart: string;
    addToCart: string;
    details: string;
    badges: {
      topseller: string;
    };
  };
  errors: {
    [key: string]: string;
  };
};

let translations: Translations = {
  product: {
    addedToWishlist: "has been added to wishlist.",
    removedFromTheWishlist: "has been removed from wishlist.",
    reason: "Reason",
    cannotAddToWishlist: "cannot be added to wishlist.",
    addedToCart: "has been added to cart.",
    addToCart: "Add to cart",
    details: "Details",
    badges: {
      topseller: "Tip",
    },
  },
  errors: {
    "product-stock-reached":
      "The product {name} is only available {quantity} times",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const { product } = toRefs(props);

const { addToCart, isInCart, count } = useAddToCart(product);

const { addToWishlist, removeFromWishlist, isInWishlist } = useProductWishlist(
  product.value.id,
);
const isLoading = ref(false);

const toggleWishlistProduct = async () => {
  isLoading.value = true;

  try {
    if (!isInWishlist.value) {
      await addToWishlist();
      pushSuccess(
        `${props.product?.translated.name} ${translations.product.addedToWishlist}`,
      );
    } else {
      await removeFromWishlist();
      pushError(
        `${props.product?.translated.name} ${translations.product.removedFromTheWishlist}`,
      );
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      const reason = error.details.errors?.[0]?.detail
        ? `${translations.product.reason}: ${error.details.errors?.[0]?.detail}`
        : "";
      return pushError(
        `${props.product?.translated.name} ${translations.product.cannotAddToWishlist}\n${reason}`,
        {
          timeout: 5000,
        },
      );
    }
  } finally {
    isLoading.value = false;
  }
};

const addToCartProxy = async () => {
  await addToCart();
  const errors = getErrorsCodes();
  errors?.forEach((element) => {
    const { messageKey, params } = resolveCartError(element);
    pushError(getCmsTranslate(translations.errors[messageKey], params));
  });

  if (!errors.length)
    pushSuccess(
      `${props.product?.translated.name} ${translations.product.addedToCart}`,
    );
};

const fromPrice = getProductFromPrice(props.product);
const { getUrlPrefix } = useUrlResolver();

const imageElement = useTemplateRef("imageElement");
const { height } = useElementSize(imageElement);

const DEFAULT_THUMBNAIL_SIZE = 10;
function roundUp(num: number) {
  return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE;
}

const srcPath = computed(() => {
  return `${getSmallestThumbnailUrl(
    product.value?.cover?.media,
  )}?&height=${roundUp(height.value)}&fit=cover`;
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
      <div class="absolute top-5 -left-1 z-10">
        <span
          v-if="product.markAsTopseller"
          class="bg-[#FFBD5D] px-2.5 py-1.5 color-black text-xl"
          >{{ translations.product.badges.topseller }}</span
        >
      </div>
      <RouterLink
        :to="buildUrlPrefix(getProductRoute(product), getUrlPrefix())"
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
      :disabled="isLoading"
      class="absolute bg-transparent top-2 right-2 hover:animate-count-infinite hover:animate-heart-beat"
      data-testid="product-box-toggle-wishlist-button"
      @click="toggleWishlistProduct"
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
        class="items-center line-clamp-2 rounded-md text-xs font-medium text-gray-600 mt-3"
      >
        {{ option.group.name }}:
        <span class="font-bold">{{ option.name }} </span>
      </p>
    </div>
    <div class="px-4 pb-4">
      <RouterLink
        class="line-clamp-2"
        :to="buildUrlPrefix(getProductRoute(product), getUrlPrefix())"
        data-testid="product-box-product-name-link"
      >
        <h5
          class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white min-h-60px"
        >
          {{ getProductName({ product }) }}
        </h5>
      </RouterLink>

      <SwListingProductPrice
        :product="product"
        class="ml-auto"
        data-testid="product-box-product-price"
      />

      <div>
        <button
          v-if="!fromPrice"
          type="button"
          class="w-full justify-center my-8 md-m-0 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transform transition duration-400 flex"
          :class="{
            'text-white bg-blue-600 hover:bg-blue-700': !isInCart,
            'text-gray-600 bg-gray-100': isInCart,
            'opacity-50 cursor-not-allowed': !product.available,
          }"
          data-testid="add-to-cart-button"
          :disabled="!product.available"
          @click="addToCartProxy"
        >
          {{ translations.product.addToCart }}
          <div v-if="isInCart" class="flex ml-2">
            <div class="w-5 h-5 i-carbon-shopping-bag text-gray-600" />
            {{ count }}
          </div>
        </button>
        <RouterLink
          v-else
          :to="buildUrlPrefix(getProductRoute(product), getUrlPrefix())"
          class=""
        >
          <div
            class="text-center justify-center w-full md:w-auto my-8 md-m-0 py-2 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transform transition duration-400"
          >
            <span data-testid="product-box-product-show-details">Details</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
