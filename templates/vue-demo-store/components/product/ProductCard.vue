<script setup lang="ts">
import { BoxLayout, DisplayMode } from "@shopware-pwa/composables-next";
import {
  getProductName,
  getProductThumbnailUrl,
  getProductUrl,
  getTranslatedProperty,
  getProductFromPrice,
} from "@shopware-pwa/helpers-next";
import { Product, PropertyGroupOption } from "@shopware-pwa/types";
import { Ref } from "vue";

const { pushSuccess, pushInfo } = useNotifications();

const props = withDefaults(
  defineProps<{
    product: Product;
    layoutType?: BoxLayout;
    displayMode?: DisplayMode;
  }>(),
  {
    layoutType: "standard",
    displayMode: "standard",
  }
);
const { product } = toRefs(props);
const { addToCart } = useAddToCart(product);

const { addToWishlist, removeFromWishlist, isInWishlist } =
  useProductWishlist(product);

const addToWishlistFn = () => {
  if (isInWishlist.value) {
    removeFromWishlist();
    pushInfo(
      `${props.product?.translated?.name} has been removed from wishlist.`
    );
  } else {
    addToWishlist();
    pushSuccess(
      `${props.product?.translated?.name} has been added to wishlist.`
    );
  }
};

const addToCartProxy = async () => {
  await addToCart();
  pushSuccess(`${props.product?.translated?.name} has been added to cart.`);
};

const fromPrice = getProductFromPrice(props.product);
const ratingAverage: Ref<number> = computed(() =>
  props.product.ratingAverage ? Math.round(props.product.ratingAverage) : 0
);
</script>

<template>
  <div
    class="sw-product-card group relative flex flex-col justify-between"
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
      />
    </div>
    <button
      aria-label="Add to wishlist"
      type="button"
      @click="addToWishlistFn"
      class="absolute top-2 right-2"
      data-testid="product-box-toggle-wishlist-button"
    >
      <div
        class="h-7 w-7"
        :class="{
          'i-carbon-favorite': !isInWishlist,
          'i-carbon-favorite-filled': isInWishlist,
          'c-red-500': isInWishlist,
        }"
        data-testid="product-box-wishlist-icon"
      />
    </button>
    <div class="mt-4 flex flex-col justify-between flex-1">
      <div>
        <h3 class="text-base font-bold text-gray-700">
          <router-link
            class="line-clamp-2 h-12"
            :to="getProductUrl(product)"
            data-testid="product-box-product-name-link"
          >
            {{ getProductName({ product }) }}
          </router-link>
        </h3>
        <div
          v-if="layoutType === 'standard'"
          class="line-clamp-4 mt-2 text-sm text-gray-500 h-20 overflow-hidden"
          v-html="getTranslatedProperty(product, 'description')"
          data-testid="product-box-product-description"
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
          <div v-for="value in ratingAverage">
            <div class="i-carbon-star-filled h-4 w-4 c-yellow-500" />
          </div>
          <div v-for="value in 5 - ratingAverage">
            <div class="i-carbon-star h-4 w-4 c-yellow-500" />
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3">
      <button
        v-if="!fromPrice"
        type="button"
        @click="addToCartProxy"
        class="mt-3 w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        data-testid="add-to-cart-button"
      >
        Add to cart
      </button>
      <router-link v-else :to="getProductUrl(product)">
        <button
          class="mt-3 w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          data-testid="product-box-product-show-details"
        >
          Details
        </button>
      </router-link>
    </div>
  </div>
</template>
