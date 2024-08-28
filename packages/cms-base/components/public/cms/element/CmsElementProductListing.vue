<script setup lang="ts">
import type { CmsElementProductListing } from "@shopware-pwa/composables-next";
import { useCmsTranslations } from "@shopware-pwa/composables-next";
import SwProductCard from "../../../SwProductCard.vue";
import SwPagination from "../../../SwPagination.vue";
import { useCategoryListing } from "#imports";
import { computed, ref, watch } from "vue";
import { defu } from "defu";
import { useRoute, useRouter } from "vue-router";
import type { Schemas, operations } from "#shopware";

const props = defineProps<{
  content: CmsElementProductListing;
}>();

const defaultLimit = 15;
const defaultPage = 1;
const defaultOrder = "name-asc";

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
};

const changeLimit = async (limit: Event) => {
  const select = limit.target as HTMLSelectElement;

  await router.push({
    query: {
      ...route.query,
      limit: select.value,
      p: defaultPage,
    },
  });
  await changeCurrentPage(
    defaultPage,
    route.query as unknown as operations["searchPage post /search"]["body"],
  );
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
    (route.query.order && route.query.order !== orderListing)
      ? true
      : false;

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
  <div class="bg-white">
    <div class="max-w-2xl mx-auto lg:max-w-full">
      <div class="mt-6">
        <div
          v-if="!loading"
          class="flex justify-center flex-wrap p-4 md:p-6 lg:p-8"
        >
          <SwProductCard
            v-for="product in getElements"
            :key="product.id"
            :product="product"
            :is-product-listing="isProductListing"
            class="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out w-full lg:w-3/7 2xl:w-7/24 mr-0 sm:mr-8 mb-8"
          />
        </div>
        <div
          v-if="loading"
          data-testid="loading"
          class="flex justify-center flex-wrap p-4 md:p-6 lg:p-8"
        >
          <ProductCardSkeleton
            v-for="index in limit"
            :key="index"
            class="w-full mb-8 sm:w-3/7 lg:w-2/7 2xl:w-7/24 mr-0 sm:mr-8 mb-8"
          />
        </div>
        <div
          class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 p-4 md:p-6 lg:p-8"
        >
          <div class="text-center place-self-center">
            <SwPagination
              :total="getTotalPagesCount"
              :current="Number(getCurrentPage)"
              @change-page="changePage"
            />
          </div>
          <div class="text-center place-self-center mt-2 lg:mt-0">
            <div
              class="inline-block align-top text-center md:text-left"
              data-testid="listing-pagination-limit-box"
            >
              <label
                for="limit"
                class="inline mr-4"
                data-testid="listing-pagination-limit-label"
                >{{ translations.listing.perPage }}</label
              >
              <select
                id="limit"
                v-model="limit"
                name="limitchoices"
                class="inline appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                data-testid="listing-pagination-limit-select"
                @change="changeLimit"
              >
                <option :value="1">1 {{ translations.listing.product }}</option>
                <option :value="15">
                  15 {{ translations.listing.products }}
                </option>
                <option :value="30">
                  30 {{ translations.listing.products }}
                </option>
                <option :value="45">
                  45 {{ translations.listing.products }}
                </option>
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
      <!-- <div v-else>
        <h2 class="mx-auto text-center">
          {{ translations.listing.noProducts }}
        </h2>
      </div> -->
    </div>
  </div>
</template>
