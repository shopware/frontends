<script setup lang="ts">
const route = useRoute();
const {
  search,
  getElements: products,
  getTotalPagesCount,
  getCurrentPage,
  changeCurrentPage,
  loading,
  setInitialListing,
  getCurrentListing,
} = useListing({
  listingType: "productSearchListing",
});

const { data: productSearch } = await useAsyncData(
  "productSearch",
  async () => {
    await search(route.query);
    return getCurrentListing.value;
  },
  {
    watch: [route],
  }
);
setInitialListing(productSearch.value as any);
</script>

<script lang="ts">
export default {
  name: "SearchResultPage",
};
</script>

<template>
  <div class="container mb-8 mx-4 md:mx-auto">
    <div
      v-if="loading"
      class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-gray-500"
    />

    <h1 class="mb-8 text-3xl font-extrabold text-center">
      <span v-if="products.length">Search Result</span>
      <span v-else>No products found</span>
    </h1>

    <ListingFilters class="mb-4" />

    <hr />

    <div
      class="grid grid-cols-1 mt-4 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

    <SharedPagination
      :total="getTotalPagesCount"
      :current="Number(getCurrentPage)"
      class="mt-10"
      @change-page="changeCurrentPage"
    />
  </div>
</template>
