<script setup lang="ts">
import type { CmsElementProductListing } from "@shopware/composables";
import { useCmsTranslations } from "@shopware/composables";
import { defu } from "defu";
import { computed, ref, useTemplateRef, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCategoryListing } from "#imports";
import type { Schemas, operations } from "#shopware";

const props = defineProps<{
  content: CmsElementProductListing;
}>();

const defaultLimit = 15;
const defaultPage = 1;
const defaultOrder = "name-asc";
const productListElement = useTemplateRef("productListElement");

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

// Use granular composables for better separation of concerns
const listing = useCategoryListing();
const { getElements, loading } = listing;
const { changeCurrentPage, getCurrentPage, getTotalPagesCount } = listing;
const route = useRoute();
const router = useRouter();
const limit = ref(
  route.query.limit
    ? Number(route.query.limit)
    : props.content?.data?.listing?.limit
      ? Number(props.content?.data?.listing?.limit)
      : defaultLimit,
);

const initalRoute = defu(route);
watch(
  () => route,
  (newRoute) => {
    if (initalRoute.path !== newRoute.path) {
      return;
    }
    if (Object.keys(newRoute.query).length > 0) {
      return;
    }
    // this fires to reset the page when query are removed/empty on client side navigation for the same page (without hard reload)
    changeCurrentPage(defaultPage, {
      limit: defaultLimit,
      p: defaultPage,
      order: defaultOrder,
    } as unknown as operations["searchPage post /search"]["body"]);
  },
  { deep: true },
);

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

compareRouteQueryWithInitialListing();
</script>

<template>
  <div class="max-w-2xl mx-auto lg:max-w-full">
    <div v-if="!loading && getElements.length < 1" class="text-center text-xl py-16 text-surface-on-surface-variant">
      {{ translations.listing.noProducts }}
    </div>
    <div v-if="!loading" ref="productListElement" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-fr gap-4 sm:gap-6 lg:gap-8">
      <SwProductCard v-for="product in getElements" :key="product.id" :product="product"
        :is-product-listing="isProductListing" class="w-full" />
    </div>
    <div v-if="loading" data-testid="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-fr gap-4 sm:gap-6 lg:gap-8">
      <ProductCardSkeleton v-for="index in limit" :key="index"
        class="w-full" />
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
