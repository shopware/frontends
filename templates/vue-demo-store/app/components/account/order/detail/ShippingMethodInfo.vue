<script setup lang="ts">
import type { Schemas } from "#shopware";

defineOptions({
  name: "AccountOrderDetailShippingMethodInfo",
});

defineProps<{
  shippingMethod: Schemas["ShippingMethod"];
}>();
</script>

<template>
  <div class="mt-8 bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      {{ $t("account.orderDetails.shippingMethod") }}
    </h3>
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div>
          <p>
            {{ shippingMethod?.translated.name }}
          </p>
          <p
            v-if="shippingMethod?.deliveryTime"
            class="text-sm text-gray-500"
          >
            {{ $t("checkout.takesUpTo") }}
            {{ shippingMethod.deliveryTime?.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
