<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = withDefaults(
  defineProps<{
    cartItem: Schemas["LineItem"];
    maxQty?: number;
  }>(),
  {
    maxQty: 100,
  },
);

const { cartItem } = toRefs(props);

const { removeItem, itemTotalPrice, isRemovable } = useCartItem(cartItem);
</script>
<template>
  <div class="mr-4 w-24 flex-shrink-0 overflow-hidden">
    <div class="w-26 i-carbon-tag text-3xl"></div>
  </div>

  <div class="flex flex-1 flex-col">
    <div>
      <div
        class="flex flex-col lg:flex-row justify-between text-base font-medium text-secondary-900"
      >
        <h3 class="text-base" data-testid="cart-promotion-name">
          {{ cartItem.label }}
          <span
            class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300"
            >{{ $t("cart.promotion") }}</span
          >
        </h3>
        <SharedPrice
          v-if="itemTotalPrice"
          :value="itemTotalPrice"
          data-testid="cart-promotion-price"
        />
      </div>
    </div>
    <div class="flex flex-1 items-end justify-end text-sm">
      <div class="flex">
        <button
          v-if="isRemovable"
          type="button"
          class="font-medium text-dark bg-transparent"
          data-testid="promotion-remove-button"
          @click="removeItem"
        >
          {{ $t("checkout.items.removeButton") }}
        </button>
      </div>
    </div>
  </div>
</template>
