<script setup lang="ts">
import { getTranslatedProperty } from "@shopware/helpers";

const {
  getWishlistProducts,
  clearWishlist,
  products,
  count,
  currentPage,
  totalPagesCount,
  canSyncWishlist,
} = useWishlist();

// Start as loading so the first render shows the loading state instead of
// flashing "You have not saved any products yet." before the wishlist arrives.
const isLoading = ref(true);
const clearError = ref("");

const loadWishlist = async (page = 1) => {
  isLoading.value = true;

  try {
    // The composable logs and swallows load errors, so there is nothing to catch.
    await getWishlistProducts({ page, limit: 15 });
  } finally {
    isLoading.value = false;
  }
};

const clear = async () => {
  clearError.value = "";
  isLoading.value = true;

  try {
    await clearWishlist();
  } catch {
    clearError.value = "The wishlist could not be emptied.";
  } finally {
    isLoading.value = false;
  }
};

// Immediate watcher instead of onMounted: it loads on mount and again when
// the customer signs in without a page change, e.g. through the login modal.
watch(
  canSyncWishlist,
  (canSync) => {
    if (canSync) {
      loadWishlist();
    }
  },
  { immediate: true },
);
</script>

<template>
  <section>
    <h1>Wishlist</h1>

    <p v-if="!canSyncWishlist">Sign in to see the products you saved.</p>

    <template v-else>
      <p v-if="isLoading">Loading wishlist...</p>
      <p v-else-if="!count">You have not saved any products yet.</p>

      <template v-else>
        <p>{{ count }} saved products</p>
        <p v-if="clearError">{{ clearError }}</p>

        <ul>
          <li v-for="product in products" :key="product.id">
            {{ getTranslatedProperty(product, "name") }}
          </li>
        </ul>

        <p>Page {{ currentPage }} of {{ totalPagesCount }}</p>

        <button
          v-if="currentPage > 1"
          type="button"
          @click="loadWishlist(currentPage - 1)"
        >
          Previous page
        </button>

        <button
          v-if="currentPage < totalPagesCount"
          type="button"
          @click="loadWishlist(currentPage + 1)"
        >
          Next page
        </button>

        <button type="button" @click="clear()">Clear this page</button>
      </template>
    </template>
  </section>
</template>
