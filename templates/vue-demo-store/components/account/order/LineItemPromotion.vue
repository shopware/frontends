<script setup lang="ts">
import type { Schemas } from "#shopware";
defineProps<{
  lineItem: Schemas["OrderLineItem"];
}>();
</script>
<template>
  <div
    class="flex flex-col sm:flex-row sm:grid grid-cols-5 gap-y-3 sm:gap-y-10 gap-x-1 py-4 border-t border-secondary-200 text-secondary-400 sm:items-center"
  >
    <div class="sm:flex items-center col-span-2 text-secondary-900">
      <div class="w-26 i-carbon-tag text-3xl text-center align-end"></div>
      <div class="my-5">
        {{ lineItem.label }}
        <span
          class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300"
          >{{ $t("cart.promotion") }}</span
        >
      </div>
    </div>
    <div class="flex justify-between">
      <div class="sm:hidden">{{ $t("account.order.quantity") }}</div>
      <div>{{ lineItem.quantity }}</div>
    </div>
    <div v-if="lineItem.unitPrice" class="flex justify-between">
      <div class="sm:hidden">{{ $t("account.order.price") }}</div>
      <SharedPrice
        :value="lineItem.unitPrice"
        class="text-secondary-600 font-normal"
        data-testid="order-item-promotion-unitprice"
      />
    </div>
    <div
      v-if="lineItem.totalPrice"
      class="flex justify-between sm:justify-self-end"
    >
      <div class="sm:hidden">{{ $t("account.order.subtotal") }}</div>
      <SharedPrice
        :value="lineItem.totalPrice"
        class="text-secondary-600 font-normal"
        data-testid="order-item-promotion-totalprice"
      />
    </div>
  </div>
</template>
