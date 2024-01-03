<script lang="ts">
export default {
  name: "WishlistPage",
};
</script>

<script setup lang="ts">
import type { Schemas } from "#shopware";

const { items, clearWishlist } = useWishlist();
const { apiClient } = useShopwareContext();
const products = ref<Schemas["Product"][]>([]);
const isLoading = ref(false);
const { t } = useI18n();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
useBreadcrumbs([
  {
    name: t("breadcrumbs.wishlist"),
    path: "/wishlist",
  },
]);
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
    const result = await apiClient.invoke("readProduct post /product", {
      ids: itemIds || items.value,
    });

    if (result?.elements) {
      products.value = result.elements;
    }
  } catch (error) {
    console.error("[wishlist][loadProductsByItemIds]", error);
  }

  isLoading.value = false;
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
        <div
          class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
        >
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
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
</template>

<style scoped></style>
