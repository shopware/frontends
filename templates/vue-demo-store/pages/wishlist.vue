<script setup lang="ts">
import type { Schemas } from "#shopware";
import defu from "defu";
import { useRoute, useRouter } from "vue-router";

const defaultLimit = 15;
const defaultPage = 1;

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
translations = defu(translations, useCmsTranslations()) as Translations;

const {
  items,
  clearWishlist,
  getWishlistProducts,
  currentPage,
  totalPagesCount,
  canSyncWishlist,
} = useWishlist();
defineOptions({
  name: "WishlistPage",
});
const { apiClient } = useShopwareContext();
const products = ref<Schemas["Product"][]>([]);
const isLoading = ref(false);
const { t } = useI18n();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const route = useRoute();
const router = useRouter();
useBreadcrumbs([
  {
    name: t("breadcrumbs.wishlist"),
    path: "/wishlist",
  },
]);
const limit = ref(route.query.limit ? Number(route.query.limit) : defaultLimit);
const clearWishlistHandler = async () => {
  try {
    isLoading.value = true;
    await clearWishlist();
  } finally {
    isLoading.value = false;
  }
};
const loadProductsByItemIds = async (itemIds: string[]): Promise<void> => {
  isLoading.value = true;

  try {
    const { data } = await apiClient.invoke("readProduct post /product", {
      body: { ids: itemIds || items.value },
    });

    if (data?.elements) {
      products.value = data.elements;
    }
  } catch (error) {
    console.error("[wishlist][loadProductsByItemIds]", error);
  }

  isLoading.value = false;
};

const changeLimit = async (limit: Event) => {
  const select = limit.target as HTMLSelectElement;
  const query = {
    ...route.query,
    limit: Number(select.value),
    page: defaultPage,
  };

  await router.push({
    query: query,
  });
  await getWishlistProducts(query);
};

const changePage = async (page: number) => {
  await router.push({
    query: {
      page: page,
      limit: limit.value,
    },
  });
  await getWishlistProducts(route.query);
};

watch(
  items,
  (items, oldItems) => {
    if (items.length !== oldItems?.length) {
      products.value = products.value.filter(({ id }) => items.includes(id));
    }
    if (!items.length) {
      return;
    }
    loadProductsByItemIds(items);
  },
  {
    immediate: true,
  },
);

const initalRoute = defu(route);
watch(
  () => route,
  (newRoute) => {
    if (initalRoute.path !== newRoute.path) {
      getWishlistProducts(); // update wishlist items when you leave wishlist page
      return;
    }
    if (Object.keys(newRoute.query).length > 0) {
      return;
    }
    // this fires to reset the page when query are removed/empty on client side navigation for the same page (without hard reload)
    getWishlistProducts({
      limit: defaultLimit,
      page: defaultPage,
    });
    limit.value = defaultLimit;
  },
  { deep: true },
);

onMounted(() => {
  const route = useRoute();
  const limit = ref(
    route.query.limit ? Number(route.query.limit) : defaultLimit,
  );
  const page = ref(route.query.page ? Number(route.query.page) : defaultPage);
  // this request is needed to start with the first page and the current limit or default limit for the pagination on wishlist page
  getWishlistProducts({
    limit: limit.value,
    page: page.value,
  });
});
</script>

<template>
  <LayoutBreadcrumbs />
  <div class="wishlist-page" data-testid="wishlist-wrapper">
    <div
      class="max-w-2xl mx-auto py-4 px-4 sm:py-4 sm:px-6 lg:max-w-7xl lg:px-8"
    >
      <!-- Wishlist is completed -->
      <div
        v-if="isLoading"
        class="absolute inset-0 flex items-center justify-center z-10 bg-white/50"
      >
        <div
          class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-secondary-500"
        />
      </div>
      <div v-else-if="products.length">
        <h1 class="my-3 text-3xl font-extrabold">
          {{ $t("wishlist.header") }}
        </h1>
        <button
          class="mb-4 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
          data-testid="clear-wishlist-button"
          @click="clearWishlistHandler"
        >
          {{ $t("wishlist.clearWishlist") }}
        </button>
        <div class="flex justify-center flex-wrap p-4 md:p-6 lg:p-8">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            class="w-full mb-8 sm:w-3/7 lg:w-2/7 2xl:w-7/24 mr-0 sm:mr-8 mb-8"
          />
        </div>
      </div>
      <!-- Empty of wishlist -->
      <div
        v-else
        class="flex flex-col items-center col mx-auto"
        data-testid="wishlist-empty"
      >
        <div class="w-48 h-48 i-carbon-favorite" />
        <h1 class="my-3 text-3xl font-extrabold">
          {{ $t("wishlist.emptyLabel") }}
        </h1>
        <p class="my-4">{{ $t("wishlist.emptyText") }}</p>
        <NuxtLink
          :to="formatLink(`/`)"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          date-testid="wishlist-empty-continue-link"
        >
          {{ $t("wishlist.continueShopping") }}
        </NuxtLink>
      </div>
    </div>
  </div>
  <div
    v-if="canSyncWishlist && products.length > 0"
    class="grid grid-cols-1 lg:flex lg:justify-center lg- gap-4 md:gap-6 lg:gap-8 p-4 md:p-6 lg:p-8"
  >
    <div class="text-center place-self-center">
      <SharedPagination
        :total="Number(totalPagesCount)"
        :current="currentPage"
        @change-page="changePage"
      />
    </div>
    <div class="text-center place-self-center mt-2 lg:mt-0">
      <div
        class="inline-block align-top text-center md:text-left"
        data-testid="wishlist-pagination-limit-box"
      >
        <label
          for="limit"
          class="inline mr-4"
          data-testid="wishlist-pagination-limit-label"
          >{{ translations.listing.perPage }}</label
        >
        <select
          id="limit"
          v-model="limit"
          name="limitchoices"
          class="inline appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          data-testid="wishlist-pagination-limit-select"
          @change="changeLimit"
        >
          <option :value="1">1 {{ translations.listing.product }}</option>
          <option :value="15">15 {{ translations.listing.products }}</option>
          <option :value="30">30 {{ translations.listing.products }}</option>
          <option :value="45">45 {{ translations.listing.products }}</option>
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
</template>

<style scoped></style>
