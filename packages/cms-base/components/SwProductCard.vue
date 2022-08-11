<script setup lang="ts">
import { BoxLayout, DisplayMode } from "@shopware-pwa/composables-next";
import {
  getProductName,
  getProductTierPrices,
  getProductCalculatedListingPrice,
  getProductThumbnailUrl,
  getProductUrl,
  getProductVariantsFromPrice,
  getProductFromPrice,
} from "@shopware-pwa/helpers-next";
import { Product } from "@shopware-pwa/types";
import { Ref } from "vue";
import SwStarIcon from "./SwStarIcon.vue";
import SwHeartIcon from "./SwHeartIcon.vue";
const heartIconType = "svg";
const heartIconClass = "wishlist-heart-icon";

const { currency } = useSessionContext();

const { pushSuccess, pushInfo } = useNotifications();

const props = withDefaults(
  defineProps<{
    product: Product;
    layoutType: BoxLayout;
    displayMode: "standard" | DisplayMode;
  }>(),
  {
    layoutType: "standard",
    displayMode: "standard",
  }
);

const { addToCart } = useAddToCart({
  product: props.product,
});

const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist({
  product: props.product,
});

const addToWishlistFn = (event: MouseEvent) => {
  if (isInWishlist.value) {
    removeFromWishlist(props.product.id);
    fillHeartColor(event, "none");
    pushInfo(
      `${props.product?.translated?.name} has been removed from wishlist.`
    );
  } else {
    addToWishlist();
    fillHeartColor(event, "red");
    pushSuccess(
      `${props.product?.translated?.name} has been added to wishlist.`
    );
  }
};

const addToCartProxy = async () => {
  await addToCart();
  pushSuccess(`${props.product?.translated?.name} has been added to cart.`);
};

function getPrice(product: Product) {
  const tierPrices = getProductTierPrices(product);
  return (
    (tierPrices.length && tierPrices[0] && tierPrices[0].unitPrice) ||
    getProductCalculatedListingPrice(product)
  );
}

const fillHeartColor = (event: MouseEvent, color: string) => {
  const srcElement = event.srcElement as any;

  if (isHeartIcon(srcElement)) {
    srcElement.attributes.fill.value = color;
  } else {
    const parentElement = srcElement.parentElement;
    if (isHeartIcon(parentElement)) {
      parentElement.attributes.fill.value = color;
    }
  }
};

const isHeartIcon = (element: SVGElement | SVGPathElement) => {
  return (
    element &&
    element.nodeName == heartIconType &&
    element.classList.contains(heartIconClass)
  );
};

const variantsFromPrice = getProductVariantsFromPrice(props.product);
const fromPrice = getProductFromPrice(props.product);
const ratingAverage: Ref<number> = computed(() =>
  props.product.ratingAverage ? Math.round(props.product.ratingAverage) : 0
);
</script>

<template>
  <div class="sw-product-card group relative flex flex-col justify-between">
    <button
      type="button"
      @click="addToWishlistFn"
      class="absolute top-2 right-2 z-40"
    >
      <SwHeartIcon :is-empty="isInWishlist ? true : false" />
    </button>
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
      />
    </div>
    <div class="mt-4 flex flex-col justify-between flex-1">
      <div>
        <h3 class="text-base font-bold text-gray-700">
          <router-link class="line-clamp-2 h-12" :to="getProductUrl(product)">
            {{ getProductName({ product }) }}
          </router-link>
        </h3>
        <p
          v-if="layoutType === 'standard'"
          class="line-clamp-4 mt-2 text-sm text-gray-500 h-20 overflow-hidden"
          v-html="product.translated.description.substring(0, 100) + '...'"
        />
        <div class="mt-2 flex gap-2 flex-wrap">
          <span
            v-for="option in product?.options"
            :key="option.id"
            class="bg-gray-400 text-sm text-white rounded py-1 px-2"
          >
            {{ option.group.name }}: {{ option.name }}
          </span>
        </div>
      </div>
      <div class="flex flex-row mt-3 justify-between">
        <div class="text-sm font-medium text-gray-900">
          {{ !fromPrice ? getPrice(product) : `From ${fromPrice}` }}
          {{ currency?.symbol }}
        </div>
        <div class="sw-product-rating inline-flex">
          <div v-for="value in ratingAverage"><SwStarIcon /></div>
          <div v-for="value in 5 - ratingAverage">
            <SwStarIcon :is-empty="true" />
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
      >
        Add to basket
      </button>
      <router-link v-else :to="getProductUrl(product)">
        <button
          class="mt-3 w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Details
        </button>
      </router-link>
    </div>
  </div>
</template>
