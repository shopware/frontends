<script setup lang="ts">
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

const props = defineProps<{
  product: Product;
}>();

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
  <div class="sw-product-card group relative">
    <div
      class="w-full h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 aspect-none"
    >
      <img
        :src="getProductThumbnailUrl(product)"
        :alt="getProductName({ product }) || ''"
        class="w-full h-full object-fill lg:w-full lg:h-full"
      />
    </div>
    <div class="mt-4 justify-between h-40">
      <div>
        <h3 class="text-sm text-gray-700">
          <router-link :to="getProductUrl(product)">
            <span
              aria-hidden="true"
              class="absolute inset-0 bottom-40px"
            ></span>
            {{ getProductName({ product }) }}
          </router-link>
        </h3>
        <button
          type="button"
          @click="addToWishlistFn"
          class="absolute top-2 right-2"
        >
          <SwHeartIcon :is-empty="isInWishlist ? true : false" />
        </button>
        <p
          class="mt-2 text-sm text-gray-500 max-h-20"
          v-html="product.translated.description.substring(0, 100) + '...'"
        ></p>
        <p class="mt-2 text-sm text-gray-500 min-h-30px">
          <span
            v-for="option in product?.options"
            :key="option.id"
            class="bg-gray-400 mr-2 text-white rounded p-1"
          >
            {{ option.group.name }}: {{ option.name }}
          </span>
        </p>
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
