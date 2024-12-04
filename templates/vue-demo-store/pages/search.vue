<script setup lang="ts">
import { useTemplateRef } from "vue";
import type { Schemas, operations } from "#shopware";
const route = useRoute();
const router = useRouter();

defineOptions({
  name: "SearchResultPage",
});

const {
  changeCurrentPage,
  getCurrentListing,
  getCurrentPage,
  getCurrentSortingOrder,
  getElements: products,
  getInitialFilters,
  getSortingOrders,
  getTotalPagesCount,
  loading,
  search,
  setInitialListing,
} = useProductSearchListing();
const { t } = useI18n();
const productListElement = useTemplateRef("productListElement");

useBreadcrumbs([
  {
    name: t("breadcrumbs.search"),
    path: "/search",
  },
]);

const createFiltersFromRoute = () => {
  const filters: Schemas["Criteria"]["filter"] = [];
  createPriceFilter(filters);
  for (const [key, value] of Object.entries(route.query)) {
    if (
      key === "p" ||
      key === "limit" ||
      key === "order" ||
      key === "search" ||
      key === "min-price" ||
      key === "max-price"
    ) {
      continue;
    }
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
          type: "multi",
          operator: "OR",
          queries: [
            {
              type: "equalsAny",
              field: "propertyIds",
              value: value,
            },
            {
              type: "equalsAny",
              field: "optionIds",
              value: value,
            },
          ],
        });
      }
      if (key === "rating") {
        filters.push({
          type: "range",
          field: "ratingAverage",
          parameters: {
            gte: +value,
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

const createPriceFilter = (filters: Schemas["Criteria"]["filter"]) => {
  const minPrice = !Number.isNaN(Number(route.query["min-price"]))
    ? (route.query["min-price"] as string)
    : undefined;

  const maxPrice = !Number.isNaN(Number(route.query["max-price"]))
    ? (route.query["max-price"] as string)
    : undefined;

  if (minPrice && maxPrice) {
    filters?.push({
      type: "range",
      field: "price",
      parameters: {
        gte: +minPrice,
        lte: +maxPrice,
      },
    });
  }
  if (minPrice && !maxPrice) {
    filters?.push({
      type: "range",
      field: "price",
      parameters: {
        gte: +minPrice,
      },
    });
  }
  if (!minPrice && maxPrice) {
    filters?.push({
      type: "range",
      field: "price",
      parameters: {
        lte: +maxPrice,
      },
    });
  }
};

const limit = ref(route.query.limit ? Number(route.query.limit) : 12);
const cacheKey = computed(() => `productSearch-${JSON.stringify(route.query)}`);
const loadProducts = async (cacheKey: string) => {
  const { data: productSearch } = await useAsyncData(cacheKey, async () => {
    const filters = createFiltersFromRoute();
    await search({
      search: route.query.search as string,
      filter: filters,
      limit: limit.value,
      order: route.query.order ? (route.query.order as string) : "name-asc",
      aggregations: [
        {
          name: "manufacturer_ids_counter",
          type: "terms",
          field: "manufacturerId",
          /* this can be slow for large datasets, we have an internal task to ignore childs in the aggregation (terms_without_children), after that this can be removed, just here for showcase **/
          aggregation: {
            name: "parent_childs",
            type: "terms",
            field: "parentId",
          },
        },
        {
          name: "option_ids_counter",
          type: "terms",
          field: "options.id",
          /* this can be slow for large datasets, we have an internal task to ignore childs in the aggregation (terms_without_children), after that this can be removed, just here for showcase **/
          aggregation: {
            name: "parent_childs",
            type: "terms",
            field: "parentId",
          },
        },
        {
          name: "property_ids_counter",
          type: "terms",
          field: "propertyIds",
          /* this can be slow for large datasets, we have an internal task to ignore childs in the aggregation (terms_without_children), after that this can be removed, just here for showcase **/
          aggregation: {
            name: "parent_childs",
            type: "terms",
            field: "parentId",
          },
        },
      ],
    });
    return getCurrentListing.value;
  });

  return productSearch;
};
const productSearch = await loadProducts(cacheKey.value);

watch(cacheKey, () => {
  setInitialListing(productSearch.value as Schemas["ProductListingResult"]);
  addCountsToFilter();
});

const changePage = async (page: number) => {
  await router.push({
    query: {
      ...route.query,
      limit: limit.value,
      p: page,
    },
  });
  await changeCurrentPage(
    page,
    route.query as unknown as operations["searchPage post /search"]["body"],
  );
  productListElement.value?.scrollIntoView({ behavior: "smooth" });
};
const changeLimit = async (limit: Event) => {
  const select = limit.target as HTMLSelectElement;

  await router.push({
    query: {
      ...route.query,
      limit: select.value,
      p: 1,
    },
  });
  await changeCurrentPage(
    1,
    route.query as unknown as operations["searchPage post /search"]["body"],
  );
  productListElement.value?.scrollIntoView({ behavior: "smooth" });
};

const isSortMenuOpen = ref(false);
const dropdownElement = useTemplateRef("dropdownElement");
onClickOutside(dropdownElement, () => {
  isSortMenuOpen.value = false;
});
const currentSortingOrder = computed({
  get: (): string => getCurrentSortingOrder.value || "",
  set: async (order: string): Promise<void> => {
    await router.push({
      query: {
        ...route.query,
        order,
      },
    });

    await loadProducts(cacheKey.value);
  },
});

setInitialListing(productSearch.value as Schemas["ProductListingResult"]);

type AggregationBucket = {
  apiAlias: string;
  key: string;
  count: number;
  parent_childs?: {
    buckets: Array<{
      apiAlias: string;
      key: string;
      count: number;
    }>;
  };
};

type FilterAndAggregations = {
  code: string;
  label: string;
  name: string;
  options: Array<Schemas["PropertyGroupOption"] & { count: number }>;
  entities: Array<Schemas["ProductManufacturer"] & { count: number }>;
  buckets?: Array<AggregationBucket>;
  apiAlias: string;
};

const addCountToFilter = (
  filter: FilterAndAggregations,
  aggregation: FilterAndAggregations,
) => {
  for (const option of filter.options) {
    if (aggregation.buckets) {
      const bucket = aggregation.buckets.find((bucket) =>
        bucket.key.includes(option.id),
      );
      if (bucket) {
        option.count = bucket.count + (option.count ?? 0);
        if (bucket.parent_childs?.buckets) {
          option.count = calculateCountByParentChildsBucket(bucket);
        }
      }
    }
  }
};

const addCountToFilterEntities = (
  filter: FilterAndAggregations,
  aggregation: FilterAndAggregations,
) => {
  for (const entity of filter.entities) {
    if (aggregation.buckets) {
      const bucket = aggregation.buckets.find(
        (bucket) => bucket.key === entity.id,
      );
      if (bucket) {
        entity.count = bucket.count + (entity.count ?? 0);
        if (bucket.parent_childs?.buckets) {
          entity.count = calculateCountByParentChildsBucket(bucket);
        }
      }
    }
  }
};

const calculateCountByParentChildsBucket = (bucket: AggregationBucket) => {
  let count = 0;
  if (bucket.parent_childs?.buckets) {
    for (const child of bucket.parent_childs.buckets) {
      if (child.key === "") {
        count = count + child.count;
      } else {
        count = count + 1;
      }
    }
  }
  return count;
};

const addCountsToFilter = () => {
  if (getInitialFilters.value) {
    for (const initialFilter of getInitialFilters.value) {
      const filter = initialFilter as unknown as FilterAndAggregations;
      if (productSearch.value?.aggregations) {
        for (const value of Object.entries(productSearch.value.aggregations)) {
          const aggregation = value[1] as unknown as FilterAndAggregations;
          if (filter.name === "manufacturer") {
            if (value[0] === "manufacturer_ids_counter") {
              addCountToFilterEntities(filter, aggregation);
            }
          }
          if (filter.code === "properties") {
            if (
              value[0] === "option_ids_counter" ||
              value[0] === "property_ids_counter"
            ) {
              addCountToFilter(filter, aggregation);
            }
          }
        }
      }
    }
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

<template>
  <LayoutBreadcrumbs />
  <div class="mb-8 mx-4 md:mx-auto" data-testid="search-results-container">
    <h1 class="mb-8 mt-8 lg:mt-0 text-3xl text-center">
      <span v-if="products?.length"
        >{{ $t("search.resultsHeader") }} "<strong>{{
          route.query.search
        }}</strong
        >"</span
      >
      <span v-else>{{ $t("search.noResults") }}</span>
    </h1>
    <div class="cms-section-sidebar grid grid-cols-12 md:grid">
      <div
        class="align-top col-span-12 md:col-span-5 lg:col-span-3 order-2 md:order-1"
      >
        <div class="px-5 mx-auto m-0">
          <div
            class="relative flex items-baseline justify-between pt-6 pb-6 border-b border-gray-200"
          >
            <div class="text-4xl tracking-tight text-gray-900">
              {{ $t("search.filters") }}
            </div>
            <div ref="dropdownElement" class="flex items-center">
              <div class="relative inline-block text-left">
                <div>
                  <button
                    id="menu-button"
                    type="button"
                    class="group inline-flex justify-center bg-transparent text-base font-medium text-gray-700 hover:text-gray-900"
                    aria-expanded="false"
                    aria-haspopup="true"
                    @click="isSortMenuOpen = !isSortMenuOpen"
                  >
                    {{ $t("listing.sort") }}
                    <div
                      class="i-carbon-chevron-down h-5 w-5 ml-1"
                      :class="{ hidden: isSortMenuOpen }"
                    ></div>
                    <div
                      class="i-carbon-chevron-up h-5 w-5 ml-1"
                      :class="{ hidden: !isSortMenuOpen }"
                    ></div>
                  </button>
                </div>
                <div
                  :class="[isSortMenuOpen ? 'absolute' : 'hidden']"
                  class="origin-top-left left-0 lg:origin-top-right lg:right-0 lg:left-auto mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-1000"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabindex="-1"
                >
                  <div class="py-1" role="none">
                    <button
                      v-for="sorting in getSortingOrders"
                      :key="sorting.key"
                      :class="[
                        sorting.key === getCurrentSortingOrder
                          ? 'font-medium text-gray-900'
                          : 'text-gray-500',
                      ]"
                      class="block px-4 py-2 text-sm bg-transparent"
                      role="menuitem"
                      tabindex="-1"
                      @click="
                        currentSortingOrder = sorting.key;
                        isSortMenuOpen = false;
                      "
                    >
                      {{ sorting.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ListingFilters class="pr-4 md:pr-8 pb-16" />
        </div>
      </div>
      <div class="col-span-12 md:col-span-7 lg:col-span-9 order-1 md:order-2">
        <div
          v-if="loading"
          data-testid="loading"
          class="flex justify-center flex-wrap p-4 md:p-6 lg:p-8"
        >
          <ProductCardSkeleton
            v-for="index in limit"
            :key="index"
            class="w-full lg:w-3/7 2xl:w-7/24 mr-0 sm:mr-8 mb-8"
          />
        </div>
        <div
          v-if="!loading"
          ref="productListElement"
          class="flex justify-center flex-wrap p-4 md:p-6 lg:p-8"
        >
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            class="w-full lg:w-3/7 2xl:w-7/24 mr-0 sm:mr-8 mb-8"
          />
        </div>
        <div
          v-if="!loading"
          class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 p-4 md:p-6 lg:p-8"
        >
          <div class="text-center place-self-center">
            <SharedPagination
              :total="getTotalPagesCount"
              :current="
                route.query.p ? Number(route.query.p) : Number(getCurrentPage)
              "
              @change-page="changePage"
            />
          </div>
          <div class="text-center place-self-center mt-2 lg:mt-0">
            <label for="limit" class="inline mr-4">{{
              $t("listing.perPage")
            }}</label>
            <select
              id="limit"
              v-model="limit"
              name="limitchoices"
              class="inline appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              @change="changeLimit"
            >
              <option :value="1">1 {{ $t("listing.product") }}</option>
              <option :value="12">12 {{ $t("listing.products") }}</option>
              <option :value="24">24 {{ $t("listing.products") }}</option>
              <option :value="32">32 {{ $t("listing.products") }}</option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
            >
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
