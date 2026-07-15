<script setup lang="ts">
import {
  getCategoryFilterAggregations,
  getCategoryFilterPostFilter,
} from "@shopware/helpers";
import { useTemplateRef } from "vue";

import type { Schemas, operations } from "#shopware";

const route = useRoute();
const router = useRouter();

const {
  getCurrentListing,
  getCurrentPage,
  getElements: products,
  getTotalPagesCount,
  loading,
  search,
  setInitialListing,
} = useProductSearchListing();

const { t } = useI18n();
const productListElement = useTemplateRef("productListElement");
const defaultLimit = 15;
const defaultPage = 1;

useBreadcrumbs([
  {
    name: t("breadcrumbs.search"),
    path: "/search",
  },
]);

// Derive `limit` from the URL so it stays a single source of truth and can
// never drift from the listing request. The setter is the one place a
// page-size change navigates (and resets to the first page).
const limit = computed({
  get: () => toNumber(firstQueryValue(route.query.limit)) ?? defaultLimit,
  set: async (value) => {
    await router.push({
      query: { ...route.query, limit: value, p: defaultPage },
    });
    productListElement.value?.scrollIntoView({ behavior: "smooth" });
  },
});

const buildSearchCriteria =
  (): operations["searchPage post /search"]["body"] => {
    const query = route.query;
    const criteria: operations["searchPage post /search"]["body"] = {
      search: firstQueryValue(query.search) ?? "",
      order: firstQueryValue(query.order) ?? "name-asc",
      // Derive from the URL (not limit.value) so the request always matches the
      // query that useAsyncData keys and watches on.
      limit: toNumber(firstQueryValue(query.limit)) ?? defaultLimit,
      p: toNumber(firstQueryValue(query.p)) ?? defaultPage,
      // Expose the categories of the result set so the sidebar can offer a
      // category filter with product counts.
      aggregations: getCategoryFilterAggregations(),
    };
    const manufacturer = firstQueryValue(query.manufacturer);
    if (manufacturer) criteria.manufacturer = manufacturer;
    const properties = firstQueryValue(query.properties);
    if (properties) criteria.properties = properties;
    const categoryIds =
      firstQueryValue(query.categories)?.split("|").filter(Boolean) ?? [];
    if (categoryIds.length > 0)
      criteria["post-filter"] = [getCategoryFilterPostFilter(categoryIds)];
    const minPrice = toNumber(firstQueryValue(query["min-price"]));
    if (minPrice !== undefined) criteria["min-price"] = minPrice;
    const maxPrice = toNumber(firstQueryValue(query["max-price"]));
    if (maxPrice !== undefined) criteria["max-price"] = maxPrice;
    const rating = toNumber(firstQueryValue(query.rating));
    if (rating !== undefined) criteria.rating = rating;
    if (query["shipping-free"])
      criteria["shipping-free"] =
        firstQueryValue(query["shipping-free"]) === "true";
    return criteria;
  };

const { data: listing } = await useAsyncData(
  () => `productSearch-${JSON.stringify(route.query)}`,
  async () => {
    await search(buildSearchCriteria());
    return getCurrentListing.value;
  },
  {
    watch: [() => route.query],
  },
);

// `listing` is serialized into the Nuxt payload, so mirror it into the shared
// listing on both server and client. The composable's own refs are
// request-scoped and don't transfer, so without this the client would render
// an empty listing (hydration mismatch) and the filter sidebar would have no
// options to build from getInitialFilters.
watch(
  listing,
  (value) => {
    if (value) {
      setInitialListing(value as Schemas["ProductListingResult"]);
    }
  },
  { immediate: true },
);

const changePage = async (page: number) => {
  await router.push({
    query: {
      ...route.query,
      p: page,
      limit: limit.value,
    },
  });
  productListElement.value?.scrollIntoView({ behavior: "smooth" });
};
</script>

<template>
  <LayoutBreadcrumbs />
  <div class="mb-8 mx-4 md:mx-auto" data-testid="search-results-container">
    <h1 v-if="!loading" class="mb-8 mt-8 lg:mt-0 text-3xl text-center">
      <span v-if="products?.length"
        >{{ $t("search.resultsHeader") }} "<strong>{{
          route.query.search
        }}</strong
        >"</span
      >
      <span v-else>{{ $t("search.noResults") }}</span>
    </h1>

    <div class="my-4 max-w-screen-2xl w-full mx-auto">
      <div class="grid grid-cols-12 gap-6 lg:gap-8">
        <aside
          class="col-span-12 md:col-span-4 lg:col-span-3 order-2 md:order-1"
        >
          <SwProductListingFilters listing-type="productSearchListing" />
        </aside>
        <div class="col-span-12 md:col-span-8 lg:col-span-9 order-1 md:order-2">
          <div
            v-if="!loading"
            ref="productListElement"
            class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 auto-rows-fr gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12 lg:gap-y-16"
          >
            <SwProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              :is-product-listing="loading"
              class="w-full"
            />
          </div>
          <div
            v-if="loading"
            data-testid="loading"
            class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 auto-rows-fr gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12 lg:gap-y-16"
          >
            <ProductCardSkeleton
              v-for="index in limit"
              :key="index"
              class="w-full"
            />
          </div>
          <SwProductListingPagination
            v-if="!loading"
            v-model:limit="limit"
            :total="getTotalPagesCount"
            :current="Number(getCurrentPage)"
            :translations="{
              listing: {
                perPage: t('search.listing.perPage'),
                product: t('search.listing.product'),
                products: t('search.listing.products'),
              },
            }"
            @change-page="changePage"
          />
        </div>
      </div>
    </div>
  </div>
</template>
