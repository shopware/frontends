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
  <div class="mt-8 bg-surface-surface p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold text-surface-on-surface mb-4">
      {{ $t("account.orderDetails.shippingMethod") }}
    </h3>
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div>
          <p class="text-surface-on-surface">
            {{ shippingMethod?.translated.name }}
          </p>
          <p
            v-if="shippingMethod?.deliveryTime"
            class="text-sm text-surface-on-surface-variant"
          >
            {{ $t("checkout.takesUpTo") }}
            {{ shippingMethod.deliveryTime?.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
