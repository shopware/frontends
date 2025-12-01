<script setup lang="ts">
import type { Schemas } from "#shopware";

const { order } = defineProps<{
  order: Schemas["Order"];
}>();

const orderDate = computed(() =>
  new Date(order.orderDate).toLocaleDateString(
    (typeof navigator !== "undefined" && navigator.language) || "en-GB",
  ),
);
</script>
<template>
  <div class="border border-outline-outline p4">
    <div class="flex justify-between pb-2 border-b border-outline-outline">
      <div class="font-bold">Order: {{ order.orderNumber }}</div>

      <AccountOrderStatus
        v-if="order.stateMachineState"
        :state="order.stateMachineState"
      />
    </div>

    <div class="mt-4 flex flex-row w-full">
      <AccountOrderLineData
        v-if="order.orderNumber"
        class="flex-1"
        label="Order number"
        :value="order.orderNumber"
      />
      <AccountOrderLineData
        class="flex-1"
        label="Shipping Status"
        :value="order.stateMachineState.name"
      />

      <AccountOrderLineData
        v-if="order.transactions?.[0]"
        class="flex-1"
        label="Payment method"
        :value="order.transactions[0].paymentMethod?.name ?? ''"
      />
      <AccountOrderLineData
        v-if="order.amountTotal"
        class="flex-1"
        label="Shipping method"
        :value="order.amountTotal"
      />
    </div>
    <div class="mt-4">
      <div class="flex justify-between">
        <div class="text-sm text-surface-on-surface-variant">Subtotal</div>
        <div>
          <SharedPrice
            class="text-surface-on-surface text-sm"
            :value="order.amountTotal"
          />
        </div>
      </div>
      <div class="flex justify-between">
        <div class="text-sm text-surface-on-surface-variant">Shipping</div>
        <div>
          <SharedPrice
            class="text-surface-on-surface text-sm"
            :value="order.shippingTotal"
          />
        </div>
      </div>
      <div
        class="border-t border-outline-outline-variant pt-2 mt-2 flex justify-between"
      >
        <div class="text-surface-on-surface">Total</div>
        <div>
          <SharedPrice
            class="text-surface-on-surface"
            :value="order.amountTotal"
          />
        </div>
      </div>
    </div>
  </div>
</template>
