<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import type { BoxLayout, DisplayMode } from "@shopware/composables";
import { useCmsTranslations } from "@shopware/composables";
import {
  buildUrlPrefix,
  getProductFromPrice,
  getProductName,
  getProductRoute,
  getSmallestThumbnailUrl,
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

const srcPath = computed(() => {
  return `${getSmallestThumbnailUrl(
    product.value?.cover?.media,
  )}?&height=${roundUp(height.value)}&fit=cover`;
});

// Computed properties for display data
const productName = computed(() => getProductName({ product: product.value }));
const productManufacturer = computed(
  () => product.value?.manufacturer?.translated?.name || "",
);
const isOnSale = computed(
  () => product.value?.calculatedPrice?.listPrice?.percentage > 0,
);
const hasOptions = computed(() => product.value?.options?.length > 0);
const isTopseller = computed(() => product.value?.markAsTopseller);

// Format price for display
const formattedPrice = computed(() => {
  const price = product.value?.calculatedPrice?.unitPrice || 0;
  return `${price.toFixed(2).replace(".", ",")} €`;
});

const formattedListPrice = computed(() => {
  if (!isOnSale.value) return null;
  const listPrice = product.value?.calculatedPrice?.listPrice?.price || 0;
  return `${listPrice.toFixed(2).replace(".", ",")} €`;
});

// Get product colors if available
const colorOptions = computed(() => {
  if (!hasOptions.value) return [];

  return (
    product.value?.options?.filter(
      (option) =>
        option.group?.name?.toLowerCase().includes("color") ||
        option.group?.name?.toLowerCase().includes("colour"),
    ) || []
  );
});
</script>

<template>
  <div class="inline-flex flex-col items-start justify-start self-stretch overflow-hidden p-px">
    <!-- Image section -->
    <div class="relative flex h-80 flex-col items-start justify-start self-stretch overflow-hidden">
      <RouterLink :to="buildUrlPrefix(getProductRoute(product), getUrlPrefix())"
        class="relative h-80 self-stretch overflow-hidden">
        <img ref="imageElement" class="absolute top-[-1px] left-[-0.98px] w-full" :src="srcPath" :alt="productName"
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
      <button aria-label="Toggle wishlist" type="button" :disabled="isLoading"
        class="bg-brand-secondary absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full"
        data-testid="product-box-toggle-wishlist-button" @click="toggleWishlistProduct">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          class="h-6 w-6 text-brand-on-secondary opacity-50 transition-transform duration-300 hover:scale-120">
          <path stroke-linecap="round" stroke-linejoin="round" class="bg-brand-on-secondary" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12
             7.636l1.318-1.318a4.5 4.5 0
             116.364 6.364L12 21.364l-7.682-8.682a4.5
             4.5 0 010-6.364z" />
        </svg>
      </button>
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
            class="text-surface-on-surface justify-start self-stretch font-['Noto_Serif'] text-2xl font-normal leading-9 h-[4.5rem] overflow-hidden line-clamp-2 display-webkit-box"
            style="-webkit-box-orient: vertical;" data-testid="product-box-product-name-link">
            {{ productName }}
          </RouterLink>
        </div>
      </div>

      <!-- Price section -->
      <div :data-sale="isOnSale ? 'yes' : 'no'" class="inline-flex items-center justify-start gap-2">
        <div v-if="isOnSale" class="flex items-center justify-start gap-2">
          <div class="text-other-sale justify-start font-['Inter'] text-base font-bold leading-normal">
            {{ formattedPrice }}
          </div>
          <div class="relative flex items-center justify-center gap-2.5">
            <div class="text-surface-on-surface-variant justify-start font-['Inter'] text-sm font-normal leading-tight">
              {{ formattedListPrice }}
            </div>
            <div class="absolute top-[12px] left-0 h-px w-16 bg-surface-on-surface-variant"></div>
          </div>
        </div>
        <div v-else class="text-surface-on-surface justify-start font-['Inter'] text-base font-bold leading-normal">
          {{ formattedPrice }}
        </div>
      </div>

      <!-- Color options -->
      <!-- <div v-if="colorOptions.length > 0" class="inline-flex w-28 flex-wrap content-center items-center justify-start gap-2">
        <div
          v-for="option in colorOptions.slice(0, 4)"
          :key="option.id"
          class="bg-surface-surface-container-lowest outline-outline-outline-variant relative h-6 w-6 overflow-hidden rounded-full outline outline-1 outline-offset-[-1px]"
        >
          <div 
            class="absolute top-[3px] left-[3px] h-4 w-4 rounded-full"
            :style="{ backgroundColor: option.colorHexCode || '#808080' }"
          ></div>
        </div>
      </div> -->
      <SwButton variant="primary" v-if="!fromPrice" size="medium" :disabled="!product?.available" block
        data-testid="add-to-cart-button" @click="addToCartProxy">
        {{ translations.product.addToCart }}
      </SwButton>


      <!-- Details button for products with fromPrice -->
      <RouterLink v-else :to="buildUrlPrefix(getProductRoute(product), getUrlPrefix())" class="self-stretch">
        <div class="bg-brand-primary inline-flex items-center justify-center gap-1 self-stretch rounded px-4 py-3"
          data-show-leading-icon="false" data-show-trailing-icon="false" data-size="regular" data-state="default"
          data-variant="primary">
          <div class="text-brand-on-primary justify-start font-['Inter'] text-base font-bold leading-normal">
            {{ translations.product.details }}
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
