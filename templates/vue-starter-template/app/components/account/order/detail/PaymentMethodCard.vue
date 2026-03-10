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
  <div class="mt-8 bg-surface-surface p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold text-surface-on-surface mb-4">
      {{ $t("account.orderDetails.paymentMethod") }}
    </h3>
    <div v-if="!isLoading" class="flex items-center justify-between">
      <div class="flex items-center">
        <div>
          <p class="text-sm font-medium text-surface-on-surface">
            {{ paymentMethod?.translated.name }}
          </p>
        </div>
      </div>
      <button
        v-if="paymentChangeable && statusTechnicalName === 'open'"
        class="px-4 py-2 bg-brand-primary text-brand-on-primary rounded hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
        @click="emit('changeRequested')"
      >
        {{ $t("account.orderDetails.change") }}
      </button>
    </div>
    <div v-else class="animate-pulse">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div
            class="w-32 h-4 bg-surface-surface-container rounded"
          ></div>
        </div>
        <div
          class="w-24 h-8 bg-surface-surface-container rounded"
        ></div>
      </div>
    </div>
  </div>
</template>
