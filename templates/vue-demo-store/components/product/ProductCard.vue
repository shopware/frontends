<script setup lang="ts">
import type { BoxLayout, DisplayMode } from "@shopware-pwa/composables-next";
import {
  getProductName,
  getProductRoute,
  getProductFromPrice,
  getSmallestThumbnailUrl,
} from "@shopware-pwa/helpers-next";
import type { Schemas } from "#shopware";
import { ApiClientError } from "@shopware/api-client";

const { pushSuccess, pushError } = useNotifications();
const { t } = useI18n();
const { getErrorsCodes } = useCartNotification();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const props = withDefaults(
  defineProps<{
    product: Schemas["Product"];
    layoutType?: BoxLayout;
    displayMode?: DisplayMode;
  }>(),
  {
    layoutType: "standard",
    displayMode: "standard",
  },
);
const { product } = toRefs(props);
const { addToCart, isInCart, count } = useAddToCart(product);

const { addToWishlist, removeFromWishlist, isInWishlist } = useProductWishlist(
  product.value.id,
);

const toggleWishlistProduct = async () => {
  if (!isInWishlist.value) {
    try {
      await addToWishlist();
      return pushSuccess(
        t(`product.messages.addedToWishlist`, {
          p: props.product?.translated?.name,
        }),
      );
    } catch (error) {
      if (error instanceof ApiClientError) {
        const reason = error.details.errors?.[0]?.detail
          ? `Reason: ${error.details.errors?.[0]?.detail}`
          : "";
        return pushError(
          `${props.product?.translated?.name} cannot be added to wishlist.\n${reason}`,
          {
            timeout: 5000,
          },
        );
      }
    }
  }
  removeFromWishlist();
};

const addToCartProxy = async () => {
  await addToCart();
  getErrorsCodes()?.forEach((element) => {
    pushError(t(`errors.${element.messageKey}`, { ...element }));
  });
  pushSuccess(
    t(`cart.messages.addedToCart`, { p: props.product?.translated?.name }),
  );
};

const fromPrice = getProductFromPrice(props.product);

const imageElement = ref(null);
const { height } = useElementSize(imageElement);

const DEFAULT_THUMBNAIL_SIZE = 10;
function roundUp(num: number) {
  return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE;
}

const srcPath = computed(() => {
  return `${getSmallestThumbnailUrl(
    product.value.cover?.media,
  )}?&height=${roundUp(height.value)}&fit=crop`;
});
</script>

<template>
  <div
    class="sw-product-card group relative max-w-full inline-block max-w-sm bg-white border border-secondary-200 rounded-md shadow transform transition duration-300 hover:scale-101"
    data-testid="product-box"
  >
    <div
      :class="[
        'w-full rounded-md overflow-hidden hover:opacity-75',
        layoutType === 'image' ? 'h-80' : 'h-60',
      ]"
    >
      <RouterLink
        :to="formatLink(getProductRoute(product))"
        class="overflow-hidden"
      >
        <img
          ref="imageElement"
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
      class="absolute bg-transparent top-2 right-2 hover:animate-count-infinite hover:animate-heart-beat"
      data-testid="product-box-toggle-wishlist-button"
      @click="toggleWishlistProduct"
    >
      <client-only>
        <div
          v-if="isInWishlist"
          class="h-7 w-7 i-carbon-favorite-filled c-red-500"
          data-testid="product-box-wishlist-icon-in"
        ></div>
        <div
          v-else
          class="h-7 w-7 i-carbon-favorite"
          data-testid="product-box-wishlist-icon-not-in"
        ></div>
        <template #placeholder>
          <div class="h-7 w-7 i-carbon-favorite"></div>
        </template>
      </client-only>
    </button>
    <div class="min-h-20px px-2">
      <span
        v-for="option in product?.options"
        :key="option.id"
        class="inline-flex items-center rounded-md bg-secondary-50 px-2 py-1 text-xs font-medium text-secondary-600 ring-1 ring-inset ring-secondary-500/10"
      >
        {{ option.group.name }}:
        {{ option.name }}
      </span>
    </div>
    <div class="px-4 pb-4">
      <RouterLink
        class="line-clamp-2"
        :to="formatLink(getProductRoute(product))"
        data-testid="product-box-product-name-link"
      >
        <h2
          class="text-xl font-semibold tracking-tight text-secondary-900 dark:text-white min-h-60px"
        >
          {{ getProductName({ product }) }}
        </h2>
      </RouterLink>
      <div class="flex items-center justify-between">
        <div class="">
          <SharedListingProductPrice
            :product="product"
            class="ml-auto"
            data-testid="product-box-product-price"
          />
        </div>

        <button
          v-if="!fromPrice"
          type="button"
          class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transform transition duration-400 md:hover:scale-120 flex"
          :class="{
            'text-white bg-primary-600 hover:bg-primary-700': !isInCart,
            'text-secondary-600 bg-secondary-100': isInCart,
          }"
          data-testid="add-to-cart-button"
          @click="addToCartProxy"
        >
          {{ $t("product.addToCart") }}
          <div v-if="isInCart" class="flex ml-2">
            <div class="w-5 h-5 i-carbon-shopping-bag text-secondary-600" />
            {{ count }}
          </div>
        </button>
        <RouterLink
          v-else
          :to="formatLink(getProductRoute(product))"
          class="justify-center py-2 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transform transition duration-400 hover:scale-120"
        >
          <span data-testid="product-box-product-show-details"> Details </span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
