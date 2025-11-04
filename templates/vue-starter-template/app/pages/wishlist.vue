<script setup lang="ts">
const loading = ref(false);

const {
  getWishlistProducts,
  currentPage,
  totalPagesCount,
  productsSync,
  limit,
} = useWishlist();

async function handleChangePage(page: number): Promise<void> {
  await getWishlistProducts({ page, limit: limit.value });
}

async function handleChangeSize(size: number): Promise<void> {
  await getWishlistProducts({ page: currentPage.value, limit: size });
}
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
        <WishlistProductTileSkeleton v-for="n in 8" :key="n" />
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
