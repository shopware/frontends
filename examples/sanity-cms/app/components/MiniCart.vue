<script setup lang="ts">
import { getSmallestThumbnailUrl } from "@shopware/helpers";

import type { Schemas } from "#shopware";

// Fixed mini cart pinned to the bottom of the viewport. Reads the shared
// Shopware cart, so adding a product anywhere updates it reactively.
const { cartItems, count, totalPrice, isEmpty, removeItem } = useCart();
const { getFormattedPrice } = usePrice();

const expanded = ref(false);

const remove = async (item: Schemas["LineItem"]) => {
  await removeItem(item);
  if (isEmpty.value) expanded.value = false;
};
</script>

<template>
  <Transition name="cart-pop">
    <div v-if="!isEmpty" class="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
      <div
        class="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-2xl shadow-slate-900/10 backdrop-blur-lg"
      >
        <!-- Line items (expandable) -->
        <div
          v-if="expanded"
          class="max-h-72 divide-y divide-slate-100 overflow-y-auto px-5 pt-2"
        >
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="flex items-center gap-3 py-3"
          >
            <img
              class="h-12 w-12 shrink-0 rounded-xl bg-slate-50 object-contain"
              :src="getSmallestThumbnailUrl(item.cover)"
              :alt="item.label"
            />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-slate-900">
                {{ item.label }}
              </p>
              <p class="text-xs text-slate-500">
                {{ item.quantity }} ×
                {{ getFormattedPrice(item.price?.unitPrice) }}
              </p>
            </div>
            <span class="text-sm font-semibold text-slate-900">
              {{ getFormattedPrice(item.price?.totalPrice) }}
            </span>
            <button
              type="button"
              class="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
              :aria-label="`Remove ${item.label}`"
              @click="remove(item)"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Summary bar -->
        <button
          type="button"
          class="flex w-full items-center justify-between gap-4 px-5 py-4"
          @click="expanded = !expanded"
        >
          <span class="flex items-center gap-3">
            <span
              class="relative grid h-11 w-11 place-items-center rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-lg text-white shadow-lg shadow-fuchsia-500/30"
            >
              🛒
              <span
                class="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-xs font-bold text-fuchsia-600 shadow"
              >
                {{ count }}
              </span>
            </span>
            <span class="text-left">
              <span class="block text-sm font-semibold text-slate-900"
                >Your cart</span
              >
              <span class="block text-xs text-slate-500">
                {{ expanded ? "Hide items" : "View items" }}
              </span>
            </span>
          </span>
          <span class="flex items-center gap-3">
            <span class="text-gradient text-xl font-extrabold">
              {{ getFormattedPrice(totalPrice) }}
            </span>
            <span
              class="text-slate-400 transition-transform"
              :class="expanded ? 'rotate-180' : ''"
            >
              ▾
            </span>
          </span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.cart-pop-enter-active,
.cart-pop-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.cart-pop-enter-from,
.cart-pop-leave-to {
  opacity: 0;
  transform: translateY(120%);
}
</style>
