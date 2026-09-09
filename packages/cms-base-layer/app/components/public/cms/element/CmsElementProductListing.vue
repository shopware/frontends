<script setup lang="ts">
import type { CmsElementProductListing } from "@shopware/composables";
import { useCmsTranslations } from "@shopware/composables";
import { until } from "@vueuse/core";
import { defu } from "defu";
import { computed, ref, useTemplateRef, watch } from "vue";
import type { LocationQuery } from "vue-router";

import {
  firstQueryValue,
  toNumber,
  useCategoryListing,
  useCmsElementConfig,
  useRoute,
  useRouter,
} from "#imports";
import type { Schemas, operations } from "#shopware";

const props = defineProps<{
  content: CmsElementProductListing;
}>();

const { getConfigValue } = useCmsElementConfig(props.content);
const defaultLimit = 15;
const defaultPage = 1;
const defaultOrder = "name-asc";
const productListElement = useTemplateRef<HTMLDivElement>("productListElement");

type Translations = {
  listing: {
    noProducts: string;
    perPage: string;
    product: string;
    products: string;
  };
};
let translations: Translations = {
  listing: {
    noProducts: "No products found 😔",
    perPage: "Per Page:",
    product: "Product",
    products: "Products",
  },
};
translations = defu(useCmsTranslations(), translations) as Translations;

const {
  changeCurrentPage,
  getCurrentPage,
  getElements,
  getTotalPagesCount,
  loading,
  setInitialListing,
} = useCategoryListing();
const route = useRoute();
const router = useRouter();
const limit = ref(
  route.query.limit
    ? Number(route.query.limit)
    : props.content?.data?.listing?.limit
      ? Number(props.content?.data?.listing?.limit)
      : defaultLimit,
);

const initialPath = route.path;

/** Query values are strings; the Store API expects numbers and booleans. */
function buildCriteria(query: LocationQuery) {
  const criteria: Record<string, unknown> = {
    limit: toNumber(firstQueryValue(query.limit)) ?? defaultLimit,
    p: toNumber(firstQueryValue(query.p)) ?? defaultPage,
    order: firstQueryValue(query.order) ?? defaultOrder,
  };

  const manufacturer = firstQueryValue(query.manufacturer);
  if (manufacturer) criteria.manufacturer = manufacturer;
  const properties = firstQueryValue(query.properties);
  if (properties) criteria.properties = properties;
  const minPrice = toNumber(firstQueryValue(query["min-price"]));
  if (minPrice !== undefined) criteria["min-price"] = minPrice;
  const maxPrice = toNumber(firstQueryValue(query["max-price"]));
  if (maxPrice !== undefined) criteria["max-price"] = maxPrice;
  const rating = toNumber(firstQueryValue(query.rating));
  if (rating !== undefined) criteria.rating = rating;
  if (query["shipping-free"])
    criteria["shipping-free"] =
      firstQueryValue(query["shipping-free"]) === "true";

  return criteria as unknown as operations["searchPage post /search"]["body"];
}

// The only place that fetches, so back and forward work.
watch(
  () => route.query,
  (query) => {
    // A different path mounts its own component.
    if (route.path !== initialPath) return;

    // The select and the skeleton count read this, so it has to follow the URL
    // too, not just the products.
    limit.value = toNumber(firstQueryValue(query.limit)) ?? defaultLimit;

    changeCurrentPage(
      toNumber(firstQueryValue(query.p)) ?? defaultPage,
      buildCriteria(query),
    );
  },
  { deep: true },
);

// `v-if="!loading"` unmounts the list while the watcher refetches, so scrolling
// straight after the push would target a node that is about to be detached.
async function scrollToListing() {
  await until(loading).toBe(false);
  productListElement.value?.scrollIntoView({ behavior: "smooth" });
}

const changePage = async (page: number) => {
  await router.push({
    query: {
      ...route.query,
      p: page,
      limit: limit.value,
    },
  });
  await scrollToListing();
};

const changeLimit = async (newLimit: number) => {
  await router.push({
    query: {
      ...route.query,
      limit: newLimit,
      p: defaultPage,
    },
  });
  await scrollToListing();
};

const isProductListing = computed(
  () => props.content?.type === "product-listing",
);
// This is a workaround because vercel caching with the nuxt preset does not support query params at the moment
// @see https://github.com/shopware/frontends/issues/687#issuecomment-1988392091
const compareRouteQueryWithInitialListing = async () => {
  const limitListing = props?.content?.data?.listing.limit ?? defaultLimit;
  const pageListing = props?.content?.data?.listing.page ?? defaultPage;
  const orderListing = props?.content?.data?.listing.sorting ?? defaultOrder;

  const isChangePageNeeded =
    (route.query.limit && limit.value !== limitListing) ||
    (route.query.p && Number(route.query.p) !== pageListing) ||
    (route.query.order && route.query.order !== orderListing);

  if (isChangePageNeeded) {
    const limitQuery = route.query.limit
      ? Number(route.query.limit)
      : defaultLimit;
    const pageQuery = route.query.p ? Number(route.query.p) : defaultPage;
    const orderQuery = route.query.order
      ? (route.query.order as string)
      : defaultOrder;
    const newQuery = {
      limit: limitQuery,
      p: pageQuery,
      order: orderQuery,
    };
    console.warn(
      "The current route does not match the initial listing. Changing the route to match the initial listing.",
    );
    limit.value = limitQuery;
    await changeCurrentPage(
      pageQuery,
      newQuery as unknown as operations["searchPage post /search"]["body"],
    );
  }
};

setInitialListing(
  props?.content?.data?.listing as Schemas["ProductListingResult"],
);

compareRouteQueryWithInitialListing();
</script>

<template>
  <div class="max-w-2xl mx-auto lg:max-w-full">
    <div
      v-if="!loading && getElements.length < 1"
      class="text-center text-xl py-16 text-surface-on-surface-variant"
    >
      {{ translations.listing.noProducts }}
    </div>
    <div
      v-if="!loading"
      ref="productListElement"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-fr gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12 lg:gap-y-16"
    >
      <SwProductCard
        v-for="product in getElements"
        :key="product.id"
        :product="product"
        :is-product-listing="isProductListing"
        :layout-type="getConfigValue('boxLayout')"
        class="w-full"
      />
    </div>
    <div
      v-if="loading"
      data-testid="loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-fr gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12 lg:gap-y-16"
    >
      <ProductCardSkeleton v-for="index in limit" :key="index" class="w-full" />
    </div>
    <SwProductListingPagination
      v-if="!loading"
      v-model:limit="limit"
      :total="getTotalPagesCount"
      :current="Number(getCurrentPage)"
      :translations="translations"
      @change-page="changePage"
      @change-limit="changeLimit"
    />
  </div>
</template>
