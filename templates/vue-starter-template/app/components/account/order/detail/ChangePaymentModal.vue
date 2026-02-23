<script setup lang="ts">
import type { Schemas } from "#shopware";

defineOptions({
  name: "AccountOrderDetailChangePaymentModal",
});

const props = defineProps<{
  isOpen: boolean;
  paymentMethods: Schemas["PaymentMethod"][];
  loading: boolean;
  currentPaymentMethodId: string;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [paymentMethodId: string];
}>();

const selectedMethodId = ref(props.currentPaymentMethodId);

watch(
  () => props.currentPaymentMethodId,
  (val) => {
    selectedMethodId.value = val;
  },
);
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-overlay-dark overflow-y-auto h-full w-full flex items-center justify-center"
  >
    <div
      class="bg-surface-surface p-8 rounded-lg shadow-xl max-w-md w-full"
    >
      <h2 class="text-2xl font-bold mb-4 text-surface-on-surface">
        {{ $t("account.orderDetails.changePaymentMethod") }}
      </h2>
      <div class="space-y-4">
        <template v-if="loading">
          <div
            v-for="i in 3"
            :key="i"
            class="flex items-center animate-pulse"
          >
            <div
              class="w-4 h-4 bg-surface-surface-container rounded-full mr-3"
            ></div>
            <div class="flex-grow">
              <div
                class="h-5 bg-surface-surface-container rounded w-1/3 mb-2"
              ></div>
              <div
                class="h-4 bg-surface-surface-container rounded w-2/3"
              ></div>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            v-for="method in paymentMethods"
            :key="method.id"
            class="flex items-center"
          >
            <input
              :id="method.id"
              v-model="selectedMethodId"
              type="radio"
              :value="method.id"
              class="mr-3"
            />
            <label :for="method.id" class="flex-grow">
              <span class="font-medium text-surface-on-surface">{{
                method.name
              }}</span>

              <span
                v-if="method.description"
                class="block text-sm text-surface-on-surface-variant"
              >
                {{ method.description }}</span
              >
            </label>
          </div>
        </template>
      </div>
      <div class="mt-6 flex justify-end space-x-3">
        <button
          class="px-4 py-2 bg-brand-tertiary text-brand-on-tertiary rounded hover:bg-brand-tertiary-hover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
          :disabled="!selectedMethodId"
          @click="emit('close')"
        >
          {{ $t("account.orderDetails.close") }}
        </button>
        <button
          class="px-4 py-2 bg-brand-primary text-brand-on-primary rounded hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
          :disabled="!selectedMethodId"
          @click="emit('confirm', selectedMethodId)"
        >
          {{ $t("account.orderDetails.confirm") }}
        </button>
      </div>
    </div>
  </div>
</template>
