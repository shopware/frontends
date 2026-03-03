<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { handleApiError } = useApiErrorsResolver("wishlist");

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const defaultLimit = 15;
const defaultPage = 1;

const loading = ref(false);
const { isLoggedIn } = useUser();

const {
  getWishlistProducts,
  currentPage,
  totalPagesCount,
  products,
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
    <template v-if="isLoggedIn">
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
            v-for="product in products"
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
    </template>
    <template v-else>
      <div
        class="flex flex-col items-center justify-center py-20 px-6 text-center"
      >
        <AccountPageHeader
          class="mb-6"
          :title="$t('wishlist.notLoggedIn.title')"
          :subtitle="$t('wishlist.notLoggedIn.description')"
        />
        <div
          class="flex flex-col sm:flex-row gap-4 items-center justify-center mt-6"
        >
          <NuxtLink
            :to="`${formatLink('/account/login')}?redirect=${encodeURIComponent(route.fullPath)}`"
            class="px-4 py-3 rounded bg-brand-primary text-brand-on-primary text-base font-bold leading-normal inline-flex justify-center items-center gap-1 hover:bg-brand-primary-hover transition-colors"
          >
            {{ $t("wishlist.notLoggedIn.login") }}
          </NuxtLink>
          <NuxtLink
            :to="`${formatLink('/account/login')}?redirect=${encodeURIComponent(route.fullPath)}#registration`"
            class="px-4 py-3 rounded bg-brand-secondary text-brand-on-secondary text-base font-bold leading-normal inline-flex justify-center items-center gap-1 hover:bg-brand-secondary-hover transition-colors"
          >
            {{ $t("wishlist.notLoggedIn.register") }}
          </NuxtLink>
          <span class="text-surface-on-surface">or</span>
          <NuxtLink
            :to="formatLink('/')"
            class="px-4 py-3 rounded bg-transparent border-1 border-brand-primary text-brand-primary text-base font-bold leading-normal inline-flex justify-center items-center gap-1 hover:bg-surface-surface-container transition-colors"
          >
            {{ $t("wishlist.notLoggedIn.continueShopping") }}
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>
