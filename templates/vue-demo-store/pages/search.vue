<script setup lang="ts">
import { ShopwareSearchParams } from "@shopware-pwa/types";
const route = useRoute();
const router = useRouter();

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
const changePage = async (page: number) => {
  await router.push({
    query: {
      ...route.query,
      p: page,
    },
  });
  changeCurrentPage(route.query as Partial<ShopwareSearchParams>);
};
setInitialListing(productSearch.value as any);
</script>

<script lang="ts">
export default {
  name: "SearchResultPage",
};
</script>

<template>
  <div
    class="container mb-8 mx-4 md:mx-auto"
    data-testid="search-results-container"
  >
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
      @change-page="changePage"
    />
  </div>
</template>
