<script>
import type { Schemas } from "#shopware";

// Contains a list of products ids in the wishlist
const { getWishlistProducts, items } = useWishlist();
const { apiClient } = useShopwareContext();

// Load products data
const loadProductsByItemIds = async (itemIds: string[]): Promise<void> => {
  isLoading.value = true;

  try {
    // Backend API call for product data
    const result = await apiClient.invoke("readProduct post /product", {
      body: {
        ids: itemIds || items.value,
      },
    });

    products.value = result.data.elements;
  } catch (error) {
    console.error(error);
  }
};

// Watch changes and update product data
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
  }
);

onMounted(async () => {
  // Fetch wishlist products
  await getWishlistProducts();
});
</script>
<template>
  <div v-if="products.length">
    <h1>Wishlist</h1>
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </div>
</template>
