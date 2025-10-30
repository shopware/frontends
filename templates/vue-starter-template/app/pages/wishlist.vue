<script setup lang="ts">
import type { Schemas } from "#shopware";

// [TODO] prevent loading wishlist items from index

const loading = ref(true);
const products = ref<Schemas["Product"][]>([]);
const { apiClient } = useShopwareContext();

const {
  items,
  clearWishlist,
  getWishlistProducts,
  currentPage,
  totalPagesCount,
  canSyncWishlist,
} = useWishlist();

const loadProductsByItemIds = async (itemIds: string[]): Promise<void> => {
  loading.value = true;

  try {
    const { data } = await apiClient.invoke("readProduct post /product", {
      body: { ids: itemIds || items.value },
    });

    if (data?.elements) {
      products.value = data.elements;
    }
  } catch (error) {
    // [TODO] handle error here
  }

  loading.value = false;
};

watch(
  items,
  (updatedItems) => {
    if (updatedItems.length > 0) {
      loadProductsByItemIds(updatedItems);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="container mx-auto mb-10 px-6 sm:px-0">
    <AccountPageHeader
      class="mb-14"
      :title="$t('wishlist.header')"
      :subtitle="$t('wishlist.subHeader')"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <template v-if="loading">
        <WishlistProductTileSkeleton v-for="n in 8" :key="n" />
      </template>
      <template v-else>
        <WishlistProductTile
          v-for="product in products"
          :key="product.id"
          :product
        />
      </template>
    </div>
  </div>
</template>
