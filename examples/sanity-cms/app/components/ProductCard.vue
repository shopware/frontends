<script setup lang="ts">
import { getSmallestThumbnailUrl, getSrcSetForMedia } from "@shopware/helpers";

import type { Schemas } from "#shopware";

const props = defineProps<{
  product: Schemas["Product"];
}>();

const product = computed(() => props.product);

const { unitPrice } = useProductPrice(product);
const { getFormattedPrice } = usePrice();
const { addToCart } = useAddToCart(product);
const { pushSuccess, pushError } = useNotifications();

const isAdding = ref(false);
const addToCartProxy = async () => {
  if (isAdding.value) return;
  isAdding.value = true;
  try {
    await addToCart();
    pushSuccess(
      `${product.value.translated?.name ?? "Product"} added to cart 🛍`,
    );
  } catch {
    pushError("Sorry, that product could not be added to the cart.");
  } finally {
    isAdding.value = false;
  }
};
</script>

<template>
  <div
    class="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
  >
    <div class="aspect-square overflow-hidden bg-slate-50">
      <img
        class="h-full w-full object-contain p-8 transition duration-500 group-hover:scale-105"
        :alt="`image of ${product?.translated?.name}`"
        :src="getSmallestThumbnailUrl(product?.cover?.media)"
        :srcset="getSrcSetForMedia(product?.cover?.media)"
      />
    </div>
    <div class="flex flex-1 flex-col p-6">
      <h3 class="line-clamp-2 text-lg font-semibold">
        {{ product?.translated?.name }}
      </h3>
      <div class="mt-4 flex items-center justify-between gap-3">
        <span class="text-gradient text-2xl font-extrabold">
          {{ getFormattedPrice(unitPrice) }}
        </span>
        <button
          type="button"
          :disabled="isAdding"
          class="shrink-0 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          @click="addToCartProxy()"
        >
          {{ isAdding ? "Adding…" : "Add 🛍" }}
        </button>
      </div>
    </div>
  </div>
</template>
