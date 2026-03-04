<script setup lang="ts">
defineOptions({
  name: "AccountOrderDetailPriceSummary",
});

defineProps<{
  subtotal?: number;
  shippingCosts?: number;
  total?: number;
}>();
</script>

<template>
  <div class="w-full sm:w-1/3">
    <div class="bg-surface-surface-container-low p-4 rounded-lg">
      <h3 class="text-lg font-semibold text-surface-on-surface mb-2">
        {{ $t("account.orderDetails.orderSummary") }}
      </h3>
      <div class="flex justify-between mb-2">
        <span class="text-sm text-surface-on-surface-variant">
          {{ $t("account.orderDetails.subtotal") }}</span
        >
        <span class="text-sm text-surface-on-surface">
          <SharedPrice
            :value="subtotal"
            class="text-surface-on-surface font-normal"
            data-testid="order-subtotal"
          />
        </span>
      </div>
      <div class="flex justify-between mb-2">
        <span class="text-sm text-surface-on-surface-variant">{{
          $t("account.orderDetails.shipping")
        }}</span>
        <span class="text-sm text-surface-on-surface">
          <SharedPrice
            :value="shippingCosts"
            class="text-surface-on-surface font-normal"
            data-testid="order-shipping"
          /></span>
      </div>

      <div
        class="border-t border-outline-outline-variant mt-2 pt-2 flex justify-between"
      >
        <span class="text-base font-semibold text-surface-on-surface">{{
          $t("account.orderDetails.total")
        }}</span>
        <span class="text-base font-semibold text-surface-on-surface">
          <SharedPrice
            :value="total"
            class="text-surface-on-surface font-normal"
            data-testid="order-total"
          /></span>
      </div>
    </div>
  </div>
</template>
