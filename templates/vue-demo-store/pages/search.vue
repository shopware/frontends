<script setup lang="ts">
import type { RequestParameters } from "#shopware";
import type { Schemas } from "#shopware";
const route = useRoute();
const router = useRouter();

const {
  search,
  getElements: products,
  getTotalPagesCount,
  getCurrentPage,
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

const cacheKey = computed(() => `productSearch-${JSON.stringify(route.query)}`);
const loadProducts = async (cacheKey: string) => {
  const { data: productSearch } = await useAsyncData(cacheKey, async () => {
    await search(route.query as unknown as RequestParameters<"searchPage">);
    return getCurrentListing.value;
  });

  return productSearch;
};
let productSearch = await loadProducts(cacheKey.value);

watch(cacheKey, async (newCacheKey) => {
  productSearch = await loadProducts(newCacheKey);
  setInitialListing(productSearch.value as Schemas["ProductListingResult"]);
});

const changePage = async (page: number) => {
  await router.push({
    query: {
      ...route.query,
      p: page,
    },
  });
};
setInitialListing(productSearch.value as Schemas["ProductListingResult"]);
</script>

<script lang="ts">
export default {
  name: "SearchResultPage",
};
</script>

<template>
  <LayoutBreadcrumbs />
  <div
    class="container mb-8 mx-4 md:mx-auto"
    data-testid="search-results-container"
  >
    <div v-if="loading" class="flex justify-center">
      <div
        class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-secondary-500"
      />
    </div>

    <h1 class="mb-8 mt-8 md:mt-0 text-3xl text-center">
      <span v-if="products?.length"
        >{{ $t("search.resultsHeader") }} "<strong>{{
          route.query.search
        }}</strong
        >"</span
      >
      <span v-else>{{ $t("search.noResults") }}</span>
    </h1>

    <div class="cms-section-sidebar flex flex-col md:block">
      <div class="inline-block align-top w-12/12 md:w-3/12 order-2 md:order-1">
        <h2>{{ $t("search.filters") }}</h2>
        <ListingFilters class="pr-4 md:pr-8" />
      </div>
      <div class="inline-block w-12/12 md:w-9/12 order-1 md:order-2">
        <div class="flex flex-wrap justify-center sm:justify-between">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            class="w-full sm:w-3/7 lg:w-2/7 mb-8"
          />
        </div>
      </div>
    </div>

    <SharedPagination
      :total="getTotalPagesCount"
      :current="Number(getCurrentPage)"
      class="mt-10"
      @change-page="changePage"
    />
  </div>
</template>
