<script setup lang="ts">
import type { Schemas } from "#shopware";
defineProps<{
  lineItem: Schemas["OrderLineItem"];
}>();
</script>
<template>
  <div class="flex gap-4 py-4 text-surface-on-surface">
    <div
      class="w-24 h-24 flex-shrink-0 bg-surface-surface-container-low flex items-center justify-center"
    >
      <div class="w-8 h-8 i-carbon-percentage text-brand-primary" />
    </div>
    <div
      class="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2"
    >
      <div>
        <div class="text-surface-on-surface leading-normal">
          {{ lineItem.label }}
        </div>
        <div class="text-sm text-surface-on-surface-variant mt-1">
          {{ $t("account.order.quantity") }} {{ lineItem.quantity }}
        </div>
      </div>
      <div class="sm:text-right shrink-0">
        <SharedPrice
          v-if="lineItem.totalPrice"
          :value="lineItem.totalPrice"
          class="text-surface-on-surface"
          data-testid="order-item-credit-totalprice"
        />
        <SharedPrice
          v-if="lineItem.unitPrice && lineItem.quantity > 1"
          :value="lineItem.unitPrice"
          class="text-sm text-surface-on-surface-variant font-normal"
          data-testid="order-item-credit-unitprice"
        />
      </div>
    </div>
  </div>
</template>
