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
} from "@shopware/helpers";
import { getCmsTranslate } from "@shopware/helpers";
import { defu } from "defu";
import { computed, ref, toRefs } from "vue";
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
      pushSuccess(
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
const productName = computed(() => getProductName({ product: product.value }));
const productManufacturer = computed(() =>
  getProductManufacturerName(product.value),
);

const { getUrlPrefix } = useUrlResolver();
const productLink = computed(() =>
  buildUrlPrefix(getProductRoute(product.value), getUrlPrefix()),
);
</script>

<template>
  <div class="p-px flex flex-col justify-start items-start overflow-hidden">
    <SwProductCardImage
      :product="product"
      :translations="translations"
      :isInWishlist="isInWishlist"
      :isLoading="isLoading"
      :toggleWishlist="toggleWishlistProduct"
      :productLink="productLink"
    />
    <SwProductCardDetails
      :product="product"
      :productName="productName"
      :productManufacturer="productManufacturer"
      :translations="translations"
      :fromPrice="fromPrice"
      :addToCartProxy="addToCartProxy"
      :productLink="productLink"
      :layoutType="layoutType"
    />
  </div>
</template>