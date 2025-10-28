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

watch(items, (updatedItems) => {
  if (updatedItems.length > 0) {
    loadProductsByItemIds(updatedItems);
  }
});
</script>

<template>
  <div class="container mx-auto">
    <AccountPageHeader
      class="mb-14"
      :title="$t('wishlist.header')"
      :subtitle="$t('wishlist.subHeader')"
    />
    <div v-if="loading">
      <div
        class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-secondary-500 mx-auto mt-5"
      />
    </div>

    aaa
    {{ products }}
    <ProductTile v-for="product in products" :key="product.id" :product />

    {{ items }}
  </div>
</template>
