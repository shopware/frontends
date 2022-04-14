<script setup lang="ts">
import { useListing } from "@shopware-pwa/composables";
const props = defineProps({
  content: Object,
});
const {
  getElements,
  setInitialListing,
  getCurrentPage,
  changeCurrentPage,
  getTotalPagesCount,
  loading,
  loadMore,
  loadingMore,
} = useListing({ listingType: "categoryListing", })

const changePage = (page: number) => {  
  changeCurrentPage(page);
}

setInitialListing(props?.content?.data?.listing);
</script>

<template>
  <div class="bg-white">
    <div
      class="max-w-2xl mx-auto py-4 px-4 sm:py-4 sm:px-6 lg:max-w-7xl lg:px-8"
    >
      <div
        class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
      >
        <SwProductCard
          v-for="product in getElements"
          :key="product._uniqueIdentifier"
          :product="product"
        />
      </div>
      <div class="mt-10">
        <SwPagination :total="getTotalPagesCount" :current="getCurrentPage" @changePage="changePage"/>
      </div>
    </div>
  </div>
</template>
