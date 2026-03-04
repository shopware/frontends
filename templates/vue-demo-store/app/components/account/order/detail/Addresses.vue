<script setup lang="ts">
import type { Schemas } from "#shopware";

defineOptions({
  name: "AccountOrderDetailAddresses",
});

defineProps<{
  shippingAddress?: Schemas["OrderAddress"];
  billingAddress?: Schemas["OrderAddress"];
}>();
</script>

<template>
  <div class="mt-8 flex flex-col sm:flex-row justify-between">
    <div v-if="shippingAddress" class="mb-4 sm:mb-0">
      <h3 class="text-lg font-semibold text-gray-700 mb-2">
        {{ $t("account.orderDetails.shippingAddress") }}
      </h3>
      <address class="not-italic text-sm text-gray-600">
        {{ shippingAddress.street }}<br />
        {{ shippingAddress.city }}
        <span v-if="shippingAddress.countryState"
          >, {{ shippingAddress.countryState }}</span
        >
        {{ shippingAddress.zipcode }}<br />
        {{ shippingAddress.country }}
      </address>
    </div>

    <div v-if="billingAddress" class="mb-4 sm:mb-0">
      <h3 class="text-lg font-semibold text-gray-700 mb-2">
        {{ $t("account.orderDetails.billingAddress") }}
      </h3>
      <address class="not-italic text-sm text-gray-600">
        {{ billingAddress.street }}<br />
        {{ billingAddress.city }}
        <span v-if="billingAddress.countryState"
          >, {{ billingAddress.countryState }}</span
        >
        {{ billingAddress.zipcode }}<br />
        {{ billingAddress.country }}
      </address>
    </div>

    <slot />
  </div>
</template>
