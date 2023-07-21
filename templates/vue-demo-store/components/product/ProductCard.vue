<script setup lang="ts">
import { BoxLayout, DisplayMode } from "@shopware-pwa/composables-next";
import {
  getProductName,
  getProductThumbnailUrl,
  getProductRoute,
  getProductFromPrice,
} from "@shopware-pwa/helpers-next";
import {
  ClientApiError,
  Product,
  PropertyGroupOption,
} from "@shopware-pwa/types";

const { pushSuccess, pushError } = useNotifications();
const { t } = useI18n();
const { codeErrorsNotification } = useCartNotification();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const props = withDefaults(
  defineProps<{
    product: Product;
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

const { addToWishlist, removeFromWishlist, isInWishlist } =
  useProductWishlist(product);

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
      const e = error as ClientApiError;
      const reason = e?.messages?.[0]?.detail
        ? `Reason: ${e?.messages?.[0]?.detail}`
        : "";
      return pushError(
        `${props.product?.translated?.name} cannot be added to wishlist.\n${reason}`,
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
  codeErrorsNotification();
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
  return `${getProductThumbnailUrl(product.value)}?&height=${roundUp(
    height.value,
  )}&fit=crop`;
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
      <img
        :src="getProductThumbnailUrl(product)"
        :alt="getProductName({ product }) || ''"
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
        loading="lazy"
      />
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
    <div class="mt-4 flex flex-col justify-between flex-1">
      <div>
        <h3 class="text-base font-bold">
          <RouterLink
            class="line-clamp-2 h-12"
            :to="getProductUrl(product)"
            data-testid="product-box-product-name-link"
          >
            {{ getProductName({ product }) }}
          </RouterLink>
        </h3>
        <div
          v-if="layoutType === 'standard'"
          class="line-clamp-4 mt-2 text-sm text-gray-500 h-20 overflow-hidden"
          data-testid="product-box-product-description"
          v-html="getTranslatedProperty(product, 'description')"
        />
        <div class="mt-2 flex gap-2 flex-wrap">
          <span
            v-for="option in product?.options"
            :key="(option as PropertyGroupOption).id"
            class="bg-gray-400 text-sm text-white rounded py-1 px-2"
            data-testid="product-box-product-options"
          >
            {{ (option as PropertyGroupOption).group.name }}:
            {{ (option as PropertyGroupOption).name }}
          </span>
        </div>
      </div>
      <div class="flex flex-col mt-3 justify-between">
        <SharedListingProductPrice
          :product="product"
          class="ml-auto"
          data-testid="product-box-product-price"
        />
        <div
          class="sw-product-rating inline-flex"
          data-testid="product-box-product-rating"
        >
          <div v-for="value in ratingAverage" :key="value">
            <div class="i-carbon-star-filled h-4 w-4 c-yellow-500" />
          </div>
          <div v-for="value in 5 - ratingAverage" :key="value">
            <div class="i-carbon-star h-4 w-4 c-yellow-500" />
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3">
      <button
        v-if="!fromPrice"
        type="button"
        class="mt-3 w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        data-testid="add-to-cart-button"
        @click="addToCartProxy"
      >
        {{ $t('add_to_cart') }}
      </button>
      <RouterLink v-else :to="getProductUrl(product)">
        <button
          class="mt-3 w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          data-testid="product-box-product-show-details"
        >
          {{ getProductName({ product }) }}
        </h5>
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
          class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transform transition duration-400 md:hover:scale-120 flex"
          :class="{
            'text-white bg-blue-500 hover:bg-blue-600': !isInCart,
            'text-gray-500 bg-gray-100': isInCart,
          }"
          data-testid="add-to-cart-button"
          @click="addToCartProxy"
        >
          {{ $t("product.addToCart") }}
          <div v-if="isInCart" class="flex ml-2">
            <div class="w-5 h-5 i-carbon-shopping-bag text-gray-600" />
            {{ count }}
          </div>
        </button>
        <RouterLink
          v-else
          :to="formatLink(getProductRoute(product))"
          class="justify-center py-2 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transform transition duration-400 hover:scale-120"
        >
          <span data-testid="product-box-product-show-details"> Details </span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
