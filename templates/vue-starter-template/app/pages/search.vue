<script setup lang="ts">
import { useTemplateRef } from "vue";
import type { operations } from "#shopware";

const route = useRoute();
const router = useRouter();
const initLoading = ref(true);

const {
  changeCurrentPage,
  getCurrentPage,
  getElements: products,
  getTotalPagesCount,
  loading,
  search,
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

const limit = ref(route.query.limit ? Number(route.query.limit) : defaultLimit);

const changePage = async (page: number) => {
  await router.push({
    query: {
      ...route.query,
      p: page,
      limit: limit.value,
    },
  });
  await changeCurrentPage(
    page,
    route.query as unknown as operations["searchPage post /search"]["body"],
  );
  productListElement.value?.scrollIntoView({ behavior: "smooth" });
};
const changeLimit = async (newLimit: number) => {
  await router.push({
    query: {
      ...route.query,
      limit: newLimit,
      p: defaultPage,
    },
  });
  await changeCurrentPage(
    defaultPage,
    route.query as unknown as operations["searchPage post /search"]["body"],
  );
  productListElement.value?.scrollIntoView({ behavior: "smooth" });
};

const isLoading = computed(() => initLoading.value || loading.value);

onBeforeMount(async () => {
  initLoading.value = true;
  await search({
    search: route.query.search as string,
    limit: limit.value,
    order: route.query.order ? (route.query.order as string) : "name-asc",
    aggregations: [
      {
        name: "manufacturer_ids_counter",
        type: "terms",
        field: "manufacturerId",
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
        aggregation: {
          name: "parent_childs",
          type: "terms",
          field: "parentId",
        },
      },
    ],
  });
  initLoading.value = false;
});
</script>

<template>
  <LayoutBreadcrumbs />
  <div class="mb-8 mx-4 md:mx-auto" data-testid="search-results-container">
    <h1 v-if="!isLoading" class="mb-8 mt-8 lg:mt-0 text-3xl text-center">
      <span v-if="products?.length"
        >{{ $t("search.resultsHeader") }} "<strong>{{
          route.query.search
        }}</strong
        >"</span
      >
      <span v-else>{{ $t("search.noResults") }}</span>
    </h1>

    <div class="my-4 max-w-screen-2xl w-full mx-auto">
      <div
        v-if="!isLoading && products.length < 1"
        class="text-center text-xl py-16 text-surface-on-surface-variant"
      ></div>
      <div
        v-if="!isLoading"
        ref="productListElement"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-fr gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12 lg:gap-y-16"
      >
        <SwProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :is-product-listing="isLoading"
          class="w-full"
        />
      </div>
      <div
        v-if="isLoading"
        data-testid="loading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-fr gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12 lg:gap-y-16"
      >
        <ProductCardSkeleton
          v-for="index in limit"
          :key="index"
          class="w-full"
        />
      </div>
      <SwProductListingPagination
        v-if="!isLoading"
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
        @change-limit="changeLimit"
      />
    </div>
  </div>
</template>
