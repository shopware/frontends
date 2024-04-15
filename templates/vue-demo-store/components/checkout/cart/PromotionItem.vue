<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  cartItem: Schemas["LineItem"];
  maxQty?: number;
}>();

const { cartItem } = toRefs(props);
const { t } = useI18n();
const { itemTotalPrice } = useCartItem(cartItem);
</script>

<template>
  <div class="flex flex-1 flex-col">
      <div
        class="flex flex-col lg:flex-row justify-between text-base font-medium text-secondary-900"
      >
        <h3 class="text-base" data-testid="cart-product-name">
          {{ cartItem.label }}
          <span
            class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300"
            >{{ t("cart.promotion") }}</span
          >
        </h3>
        <SharedPrice
          v-if="itemTotalPrice"
          :value="itemTotalPrice"
          data-testid="cart-product-price"
        />
      </div>
  </div>
</template>
