<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import type { BoxLayout, DisplayMode } from "@shopware/composables";
import { useCmsTranslations } from "@shopware/composables";
import {
  buildUrlPrefix,
  getProductFromPrice,
  getProductManufacturerName,
  getProductName,
  getProductRoute,
  getSmallestThumbnailUrl,
  isProductOnSale,
  isProductTopSeller,
} from "@shopware/helpers";
import { getCmsTranslate } from "@shopware/helpers";
import { useElementSize } from "@vueuse/core";
import { defu } from "defu";
import { computed, ref, toRefs, useTemplateRef } from "vue";
import { RouterLink } from "vue-router";
import {
  useAddToCart,
  useCartErrorParamsResolver,
  useCartNotification,
  useNotifications,
  useProductWishlist,
  useUrlResolver,
} from "#imports";
import type { Schemas } from "#shopware";

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

const { addToCart } = useAddToCart(product);

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
  for (const element of errors) {
    const { messageKey, params } = resolveCartError(element);
    if (translations.errors[messageKey])
      pushError(getCmsTranslate(translations.errors[messageKey], params));
  }

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

const coverSrcPath = computed(() => {
  return `${getSmallestThumbnailUrl(
    product.value?.cover?.media,
  )}?&height=${roundUp(height.value)}&fit=cover`;
});

const coverAlt = computed(() => {
  return product.value?.cover?.media?.alt || product.value?.translated.name;
});

// Computed properties for display data
const productName = computed(() => getProductName({ product: product.value }));
const productManufacturer = computed(() =>
  getProductManufacturerName(product.value),
);
const isOnSale = computed(() => isProductOnSale(product.value));
const isTopseller = computed(() => isProductTopSeller(product.value));
</script>

<template>
  <div class="inline-flex flex-col items-start justify-start self-stretch overflow-hidden p-px w-full">
    <!-- Image section -->
    <div class="relative flex h-80 flex-col items-start justify-start self-stretch overflow-hidden">
      <RouterLink :to="buildUrlPrefix(getProductRoute(product), getUrlPrefix())"
        class="relative h-80 self-stretch overflow-hidden">
        <img ref="imageElement" class="absolute top-[-1px] left-[-0.98px] w-full" :src="coverSrcPath" :alt="coverAlt"
          data-testid="product-box-img" />
      </RouterLink>
      <!-- Badge for topseller or sale -->
      <div v-if="isTopseller || isOnSale"
        class="absolute top-[281px] left-[8px] inline-flex items-center justify-center rounded bg-states-error px-1.5 py-1"
        data-state="default" data-type="error">
        <div class="justify-start font-['Inter'] text-xs font-bold leading-none text-states-on-error">
          {{ translations.product.badges.topseller }}
        </div>
      </div>
      <!-- Wishlist button -->
      <client-only>
        <SwIconButton type="secondary" aria-label="Toggle wishlist" :disabled="isLoading"
          class=" bg-brand-secondary absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full"
          data-testid="product-box-toggle-wishlist-button" @click="toggleWishlistProduct">
          <SwWishlistIcon :filled="isInWishlist" />
        </SwIconButton>
      </client-only>
    </div>
    <!-- Product details section -->
    <div class="flex flex-col items-start justify-start gap-4 self-stretch p-2">
      <!-- Manufacturer and product name -->
      <div class="flex flex-col items-start justify-start gap-2 self-stretch">
        <div class="flex flex-col items-start justify-start gap-1 self-stretch">
          <div v-if="productManufacturer"
            class="text-surface-on-surface justify-start self-stretch font-['Inter'] text-sm font-bold leading-tight">
            {{ productManufacturer }}
          </div>
          <RouterLink :to="buildUrlPrefix(getProductRoute(product), getUrlPrefix())"
            class="text-surface-on-surface justify-start self-stretch font-['Noto_Serif'] text-2xl font-normal leading-9 h-[4.5] overflow-hidden line-clamp-2 display-webkit-box"
            style="-webkit-box-orient: vertical;" data-testid="product-box-product-name-link">
            {{ productName }}
          </RouterLink>
        </div>
      </div>
      <!-- Price section -->
      <SwListingProductPrice :product="product" class="" data-testid="product-box-product-price" />
      <SwBaseButton variant="primary" v-if="!fromPrice" size="medium" :disabled="!product?.available" block
        data-testid="add-to-cart-button" @click="addToCartProxy">
        {{ translations.product.addToCart }}
      </SwBaseButton>
      <!-- Details button for products with fromPrice -->
      <RouterLink v-else :to="buildUrlPrefix(getProductRoute(product), getUrlPrefix())" class="self-stretch">
        <SwBaseButton block>
          {{ translations.product.details }}
        </SwBaseButton>
      </RouterLink>
    </div>
  </div>
</template>