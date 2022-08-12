<script setup lang="ts">
import { CmsElementProductListing } from "@shopware-pwa/composables-next";
const props = defineProps<{
  content: CmsElementProductListing;
}>();
const {
  getElements,
  setInitialListing,
  getCurrentPage,
  changeCurrentPage,
  getTotalPagesCount,
  loading,
  loadMore,
  loadingMore,
} = useListing({ listingType: "categoryListing" });

const changePage = (page: number) => {
  changeCurrentPage(page);
};
const isProductListing = computed(
  () => props.content?.type === "product-listing"
);
setInitialListing(props?.content?.data?.listing);
</script>

<template>
  <div class="bg-white">
    <div
      class="max-w-2xl mx-auto py-4 px-4 sm:py-4 sm:px-6 lg:max-w-7xl lg:px-8"
    >
      <div v-if="getElements.length">
        <div
          class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
        >
          <SwProductCard
            v-for="product in getElements"
            :key="product.id"
            :product="product"
            :isProductListing="isProductListing"
          />
        </div>
        <div class="mt-10">
          <SwPagination
            :total="getTotalPagesCount"
            :current="Number(getCurrentPage)"
            @changePage="changePage"
          />
        </div>
      </div>
      <div v-else>
        <h2 class="mx-auto text-center">No products found 😔</h2>
      </div>
    </div>
  </div>
</template>
