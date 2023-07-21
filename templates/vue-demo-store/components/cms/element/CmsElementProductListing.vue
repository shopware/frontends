<script setup lang="ts">
import { CmsElementProductListing } from "@shopware-pwa/composables-next";
import SwProductCard from "../../SwProductCard.vue";

const props = defineProps<{
  content: CmsElementProductListing;
}>();
const {
  getElements,
  setInitialListing,
  getTotal,
  loadMore,
  loadingMore,
} = useListing({ listingType: "categoryListing" });

const isProductListing = computed(
  () => props.content?.type === "product-listing"
);

setInitialListing(props?.content?.data?.listing);
</script>

<template>
  <div>
    <div v-if="getElements.length">
      <div
        class="mt-6 grid grid-cols-2 gap-y-6 gap-x-4 md:grid-cols-3 md:gap-8"
      >
        <SwProductCard
          v-for="product in getElements"
          :key="product.id"
          :product="product"
          :isProductListing="isProductListing"
        />
      </div>
      <div class="flex flex-col items-center space-y-4 justify-center mt-6 md:mt-8">
        <p><span class="font-semibold text-base">{{ getElements.length }}</span> {{ $t('of') }} <span class="font-semibold text-base">{{ getTotal }}</span> {{ $t('products') }}</p>
        <button
          v-if="getTotal > getElements.length"
          class="text-white text-base font-medium py-3 px-6 bg-gray-800 shadow-sm disabled:opacity-50"
          @click="loadMore"
          :disabled="loadingMore"
        >
          {{ $t('load_more') }}
        </button>
      </div>
    </div>
    <div v-else>
      <h2 class="mx-auto text-center">{{ $t('no_products_found') }}</h2>
    </div>
  </div>
</template>
