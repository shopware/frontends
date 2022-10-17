<script setup lang="ts">
const route = useRoute();
const {
  search,
  getElements: products,
  getTotalPagesCount,
  getCurrentPage,
  changeCurrentPage,
  loading,
} = useListing({
  listingType: "productSearchListing",
});

await useAsyncData(
  "productSearch",
  () => {
    return search(route.query);
  },
  {
    watch: [route],
  }
);
</script>

<script lang="ts">
export default {
  name: "SearchResultPage",
};
</script>

<template>
  <div class="container mb-8 mx-4 md:mx-auto">
    <IconsLoadingCircle v-if="loading" />

    <h1 class="mb-8 text-3xl font-extrabold text-center">
      <span v-if="products.length">Search Result</span>
      <span v-else>No products found</span>
    </h1>

    <ListingFilters class="mb-4" />

    <hr />

    <div
      class="grid grid-cols-1 mt-4 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
    >
      <SwProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

    <SwPagination
      :total="getTotalPagesCount"
      :current="Number(getCurrentPage)"
      class="mt-10"
      @change-page="changeCurrentPage"
    />
  </div>
</template>
