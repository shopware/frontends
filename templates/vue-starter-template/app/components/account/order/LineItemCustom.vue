<script setup lang="ts">
import type { Schemas } from "#shopware";
defineProps<{
  lineItem: Schemas["OrderLineItem"];
}>();
</script>
<template>
  <div
    class="flex flex-col sm:flex-row sm:grid grid-cols-5 gap-y-3 sm:gap-y-10 gap-x-1 py-4 border-t  border-outline-outline text-surface-on-surface sm:items-center"
  >
    <div class="sm:flex items-center col-span-2 text-surface-on-surface">
      <div class="w-26 i-carbon-image text-3xl text-center align-end"></div>
      <div class="my-5 text-center">
        {{ lineItem.label }}
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
        class="text-surface-on-surface font-normal"
        data-testid="order-item-custom-unitprice"
      />
    </div>
    <div
      v-if="lineItem.totalPrice"
      class="flex justify-between sm:justify-self-end"
    >
      <div class="sm:hidden">{{ $t("account.order.subtotal") }}</div>
      <SharedPrice
        :value="lineItem.totalPrice"
        class="text-surface-on-surface font-normal"
        data-testid="order-item-custom-totalprice"
      />
    </div>
  </div>
</template>
