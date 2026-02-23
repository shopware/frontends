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
    <div class="bg-gray-50 p-4 rounded-lg">
      <h3 class="text-lg font-semibold text-gray-700 mb-2">
        {{ $t("account.orderDetails.orderSummary") }}
      </h3>
      <div class="flex justify-between mb-2">
        <span class="text-sm text-gray-600">
          {{ $t("account.orderDetails.subtotal") }}</span
        >
        <span class="text-sm text-gray-900">
          <SharedPrice
            :value="subtotal"
            class="text-secondary-600 font-normal"
            data-testid="order-subtotal"
          />
        </span>
      </div>
      <div class="flex justify-between mb-2">
        <span class="text-sm text-gray-600">{{
          $t("account.orderDetails.shipping")
        }}</span>
        <span class="text-sm text-gray-900">
          <SharedPrice
            :value="shippingCosts"
            class="text-secondary-600 font-normal"
            data-testid="order-shipping"
          /></span>
      </div>

      <div
        class="border-t border-gray-200 mt-2 pt-2 flex justify-between"
      >
        <span class="text-base font-semibold text-gray-900">{{
          $t("account.orderDetails.total")
        }}</span>
        <span class="text-base font-semibold text-gray-900">
          <SharedPrice
            :value="total"
            class="text-secondary-600 font-normal"
            data-testid="order-total"
          /></span>
      </div>
    </div>
  </div>
</template>
