<script setup lang="ts">
import type { Schemas } from "#shopware";

defineOptions({
  name: "AccountOrderDetailPaymentMethodCard",
});

defineProps<{
  paymentMethod: Schemas["PaymentMethod"];
  paymentChangeable: boolean;
  statusTechnicalName?: string;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  changeRequested: [];
}>();
</script>

<template>
  <div class="mt-8 bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      {{ $t("account.orderDetails.paymentMethod") }}
    </h3>
    <div v-if="!isLoading" class="flex items-center justify-between">
      <div class="flex items-center">
        <div>
          <p class="text-sm font-medium text-gray-900">
            {{ paymentMethod?.translated.name }}
          </p>
        </div>
      </div>
      <button
        v-if="paymentChangeable && statusTechnicalName === 'open'"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        @click="emit('changeRequested')"
      >
        {{ $t("account.orderDetails.change") }}
      </button>
    </div>
    <div v-else class="animate-pulse">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-32 h-4 bg-gray-200 rounded"></div>
        </div>
        <div class="w-24 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
</template>
