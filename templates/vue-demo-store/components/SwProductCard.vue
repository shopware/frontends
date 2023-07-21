<script setup lang="ts">
import { RouterLink } from "vue-router";
import {
  BoxLayout,
  DisplayMode,
  // useProductPrice,
} from "@shopware-pwa/composables-next";
import {
  getProductName,
  getProductThumbnailUrl,
  getProductUrl,
  // getTranslatedProperty,
  getProductFromPrice,
} from "@shopware-pwa/helpers-next";
import {
  Product,
  // PropertyGroupOption,
} from "@shopware-pwa/types";
import SwListingProductPrice from "./SwListingProductPrice.vue";
import SharedReviews from './shared/SharedReviews.vue';
import SwAddToWishlist from './SwAddToWishlist.vue';
import { getPath } from "~~/helpers";

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
  }
);
const router = useRouter();

const { product } = toRefs(props);

const goToProductDetail =  () => {
  router.push(getProductUrl(product.value))
}
</script>

<template>
  <div
    class="sw-product-card group relative flex flex-col justify-between"
    data-testid="product-box"
  >
    <SwAddToWishlist 
      class="absolute z-10 top-2 right-2 rounded-full bg-white bg-opacity-50 p-1"
      :product="product"
    />
    <div class="aspect-[2/3] w-full overflow-hidden bg-gray-300 hover:opacity-75">
      <nuxt-img
        @click="goToProductDetail"
        :src="getPath(getProductThumbnailUrl(product))"
        :alt="getProductName({ product }) || ''"
        class="cursor-pointer h-full w-full object-cover object-center lg:h-full lg:w-full"
        loading="lazy"
      />
    </div>
    <div class="mt-4 flex justify-between">
      <div>
        <h3 class="text-base p-0">
          <a
            class="cursor-pointer line-clamp-1 h-6 font-medium text-sm md:text-base text-start"
            data-testid="product-box-product-name-link"
            @click="goToProductDetail"
          >
            {{ getProductName({ product }) }}
          </a>
        </h3>
        <SwListingProductPrice
          :product="product"
          class="ml-auto"
          data-testid="product-box-product-price"
        />
        <SharedReviews :product="product" :hide-count="false" />
      </div>
    </div>
  </div>
</template>
