<script setup lang="ts">
import { Product, ClientApiError } from "@shopware-pwa/types";
import {
  HeartIcon as HeartSolidIcon
} from '@heroicons/vue/24/solid';

import {
  HeartIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  product: Product;
}>();
const { pushSuccess, pushError } = useNotifications();

const product = computed<Product>(() => props.product);

const { addToWishlist, removeFromWishlist, isInWishlist } =
  useProductWishlist(product);

const toggleWishlistProduct = async () => {
  if (!isInWishlist.value) {
    try {
      await addToWishlist();
      return pushSuccess(
        `${props.product?.translated?.name} has been added to wishlist.`
      );
    } catch (error) {
      const e = error as ClientApiError;
      const reason = e?.messages?.[0]?.detail
        ? `Reason: ${e?.messages?.[0]?.detail}`
        : "";
      return pushError(
        `${props.product?.translated?.name} cannot be added to wishlist.\n${reason}`,
        {
          timeout: 5000,
        }
      );
    }
  }
  removeFromWishlist();
};
</script>

<template>
  <button
    aria-label="Add to wishlist"
    type="button"
    @click="toggleWishlistProduct"
    data-testid="product-box-toggle-wishlist-button"
  >
    <client-only>
      <HeartSolidIcon
        v-if="isInWishlist"
        class="h-6 w-6 text-gray-900"
      />
      <HeartIcon
        v-else
        class="h-6 w-6"
      />
      <template #placeholder>
        <HeartIcon class="h-6 w-6" />
      </template>
    </client-only>
  </button>
</template>
