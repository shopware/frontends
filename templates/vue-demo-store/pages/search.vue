<script setup lang="ts">
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
  getInitialFilters,
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

const createFiltersFromRoute = () => {
  const filters: {
    field: string;
    type: string;
    value?: string | string[] | boolean;
    parameters?: {
      gte?: string;
      lte?: string;
    };
  }[] = [];
  for (const [key, value] of Object.entries(route.query)) {
    const currentValue = value as string;
    const allValues = currentValue.split("|");
    for (const value of allValues) {
      if (key === "manufacturer") {
        filters.push({
          type: "equals",
          field: "manufacturerId",
          value: value,
        });
      }
      if (key === "properties") {
        filters.push({
          type: "equalsAny",
          field: "optionIds",
          value: value,
        });
      }
      if (key === "price") {
        const [min, max] = value.split("-");
        filters.push({
          type: "range",
          field: "price",
          parameters: {
            gte: min,
            lte: max,
          },
        });
      }
      if (key === "rating") {
        filters.push({
          type: "range",
          field: "ratingAverage",
          parameters: {
            gte: value,
          },
        });
      }
      if (key === "shipping-free") {
        filters.push({
          type: "equals",
          field: "shippingFree",
          value: true,
        });
      }
    }
  }
  return filters;
};

const cacheKey = computed(() => `productSearch-${JSON.stringify(route.query)}`);
const loadProducts = async (cacheKey: string) => {
  const { data: productSearch } = await useAsyncData(cacheKey, async () => {
    const filters = createFiltersFromRoute();
    await search({
      search: route.query.search as string,
      filter: filters,
      aggregations: [
        {
          name: "manufacturer_ids_counter",
          type: "terms",
          field: "manufacturerId",
        },
        {
          name: "option_ids_counter",
          type: "terms",
          field: "optionIds",
        },
      ],
    });
    return getCurrentListing.value;
  });

  return productSearch;
};
let productSearch = await loadProducts(cacheKey.value);

watch(cacheKey, async (newCacheKey) => {
  productSearch = await loadProducts(newCacheKey);
  setInitialListing(productSearch.value as Schemas["ProductListingResult"]);
  addCountsToFilter();
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

type FilterAndAggregations = {
  code: string;
  label: string;
  name: string;
  options: Array<Schemas["PropertyGroupOption"] & { count: number }>;
  entities: Array<Schemas["ProductManufacturer"] & { count: number }>;
  buckets?: Array<{
    apiAlias: string;
    key: string; // can be "", "5e698b809f75483196868427ec5abd8e" or "["5e698b809f75483196868427ec5abd8e"]"
    count: number;
  }>;
  apiAlias: string;
};

const addCountToFilterOptions = (
  filter: FilterAndAggregations,
  aggregation: FilterAndAggregations,
) => {
  filter.options.forEach((option) => {
    if (aggregation.buckets) {
      const bucket = aggregation.buckets.find((bucket) =>
        bucket.key.includes(option.id),
      );
      if (bucket) {
        option.count = bucket.count + (option.count ?? 0);
      }
    }
  });
};

const addCountToFilterEntities = (
  filter: FilterAndAggregations,
  aggregation: FilterAndAggregations,
) => {
  filter.entities.forEach((entity) => {
    if (aggregation.buckets) {
      const bucket = aggregation.buckets.find(
        (bucket) => bucket.key === entity.id,
      );
      if (bucket) {
        entity.count = bucket.count + (entity.count ?? 0);
      }
    }
  });
};

const addCountsToFilter = () => {
  if (getInitialFilters.value) {
    getInitialFilters.value.forEach((initialFilter) => {
      const filter = initialFilter as unknown as FilterAndAggregations;
      if (productSearch.value && productSearch.value.aggregations) {
        for (const value of Object.entries(productSearch.value.aggregations)) {
          const aggregation = value[1] as unknown as FilterAndAggregations;
          if (filter.name === "manufacturer") {
            if (value[0] === "manufacturer_ids_counter") {
              addCountToFilterEntities(filter, aggregation);
            }
          }
          if (filter.code === "properties") {
            if (value[0] === "option_ids_counter") {
              addCountToFilterOptions(filter, aggregation);
            }
          }
        }
      }
    });
  }
};

addCountsToFilter();

const openFilters = () => {
  const query = router.currentRoute.value.query;
  for (const [key, value] of Object.entries(query)) {
    const currentValue = value as string;
    const firstValue = currentValue.split("|")[0];
    document
      .getElementById(`filter-mobile-${key}-${firstValue}`)
      ?.closest("[selected-filters]")
      ?.querySelector("button")
      ?.click();
  }
};

onMounted(() => {
  openFilters();
});
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
        class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-gray-500"
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
