<script lang="ts">
export default {
  name: "WishlistPage",
};
</script>

<script setup lang="ts">
import { getProducts } from "@shopware-pwa/shopware-6-client";
import { Shopware } from "@shopware-pwa/composables-next";

const { items } = useWishlist();
const { apiInstance } = useShopwareContext();
const products = ref<Shopware.Product[]>([]);
const isLoading = ref(false);

const loadProductsByItemIds = async (itemIds: string[]): Promise<void> => {
  isLoading.value = true;

  try {
    const result = await getProducts(
      {
        ids: itemIds || items.value,
      },
      apiInstance
    );

    if (result) {
      products.value = result.elements;
    }
  } catch (error) {
    console.error(
      "[wishlist][loadProductsByItemIds]",
      (error as Shopware.ClientApiError).messages
    );
  }

  isLoading.value = false;
};

onMounted(async () => {
  if (!items.value.length) {
    return;
  }
  loadProductsByItemIds(items.value);
});

watch(items, (items, oldItems) => {
  if (items.length !== oldItems.length) {
    products.value = products.value.filter(({ id }) => items.includes(id));
  }
});
</script>

<template>
  <div class="wishlist-page">
    <div
      class="max-w-2xl mx-auto py-4 px-4 sm:py-4 sm:px-6 lg:max-w-7xl lg:px-8"
    >
      <!-- Wishlist is loading -->
      <div v-if="isLoading">Loading...</div>
      <!-- Wishlist is completed -->
      <div v-else-if="products.length">
        <h1 class="my-3 text-3xl font-extrabold">Wishlist</h1>
        <div
          class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
        >
          <SwProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
      <!-- Empty of wishlist -->
      <div v-else class="flex flex-col items-center col mx-auto">
        <img
          class="w-24 h-24"
          src="~/assets/empty-wishlist.svg"
          alt="Empty wishlist"
        />
        <h1 class="my-3 text-3xl font-extrabold">Wishlist is empty</h1>
        <p class="my-4">No products were added to the Wishlist.</p>
        <nuxt-link
          to="/"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
        >
          Continue Shopping
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
