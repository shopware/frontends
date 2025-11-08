<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { handleApiError } = useApiErrorsResolver("wishlist");

const defaultLimit = 15;
const defaultPage = 1;

const loading = ref(false);

const {
  getWishlistProducts,
  currentPage,
  totalPagesCount,
  productsSync,
  limit,
  items,
} = useWishlist();

const initialPage = route.query.p ? Number(route.query.p) : defaultPage;
const initialLimit = route.query.limit
  ? Number(route.query.limit)
  : defaultLimit;

async function handleChangePage(page: number): Promise<void> {
  await router.push({
    query: {
      ...route.query,
      p: page,
      limit: limit.value,
    },
  });
  getWishlistProductsProxy({ page });
}

async function handleChangeSize(size: number): Promise<void> {
  await router.push({
    query: {
      ...route.query,
      p: defaultPage,
      limit: size,
    },
  });
  await getWishlistProductsProxy({ limit: size });
}

async function getWishlistProductsProxy(options?: {
  page?: number;
  limit?: number;
}) {
  loading.value = true;
  try {
    await getWishlistProducts({
      page: options?.page ?? initialPage,
      limit: options?.limit ?? initialLimit,
    });

    // Check if it is not out of scope
    if (items.value.length === 0 && currentPage.value > 1) {
      await router.push(route.path);
      await window.location.reload();
    }
  } catch (error) {
    handleApiError(error);
  } finally {
    loading.value = false;
  }
}

loading.value = true;
await getWishlistProductsProxy({ page: initialPage, limit: initialLimit });
loading.value = false;
</script>

<template>
  <div class="container mx-auto mb-10 px-6 sm:px-0">
    <AccountPageHeader
      class="mb-14"
      :title="$t('wishlist.header')"
      :subtitle="$t('wishlist.subHeader')"
    />

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10"
    >
      <template v-if="loading">
        <WishlistProductTileSkeleton v-for="n in limit || 15" :key="n" />
      </template>
      <template v-else>
        <WishlistProductTile
          v-for="product in productsSync"
          :key="product.id"
          :product
        />
      </template>
    </div>

    <SharedElementsNavigation
      class="block"
      :show-page-size-selector="true"
      :pages="totalPagesCount"
      :current-page="currentPage"
      :page-size="limit"
      @change-page="handleChangePage"
      @change-size="handleChangeSize"
    />
  </div>
</template>
