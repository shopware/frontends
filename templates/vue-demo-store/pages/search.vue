<script setup lang="ts">
import {
  ListingResult,
  Product,
  ShopwareSearchParams,
} from "@shopware-pwa/types";
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
const { t } = useI18n();
useBreadcrumbs([
  {
    name: t("breadcrumbs.search"),
    path: "/search",
  },
]);

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
  changeCurrentPage(page, route.query as Partial<ShopwareSearchParams>);
};
setInitialListing(productSearch.value as Partial<ListingResult<Product>>);
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
    <div v-if="loading" class="flex justify-center">
      <div
        class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-gray-500"
      />
    </div>

    <h1 class="mb-8 text-3xl font-extrabold text-center">
      <span v-if="products.length">{{ $t("search.resultsHeader") }}</span>
      <span v-else>{{ $t("search.noResults") }}</span>
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
