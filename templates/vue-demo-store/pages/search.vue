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

await useAsyncData("productSearch", () => search(route.query), {
  watch: [route],
});
</script>

<script lang="ts">
export default {
  name: "SearchResultPage",
};
</script>

<template>
  <div class="container mb-8 mx-4 md:mx-auto">
    <IconsLoadingCircle v-if="loading" />

    <template v-else-if="products.length">
      <h1 class="mb-8 text-3xl font-extrabold text-center">Search Result</h1>
      <div
        class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
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
    </template>
    <h1 v-else class="mb-8 text-3xl font-extrabold text-center">
      No products found
    </h1>
  </div>
</template>
