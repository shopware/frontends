<script setup lang="ts">
import { getPaymentMethodIcon } from "@shopware/helpers";
import type { Schemas } from "#shopware";

const { paymentMethods } = defineProps<{
  paymentMethods: Schemas["PaymentMethod"][];
}>();

const emit = defineEmits<{
  change: [id: string];
}>();

const selectedPaymentMethod = defineModel<string | null>(
  "selectedPaymentMethod",
  {
    required: true,
  },
);

function handleChange(id: string) {
  emit("change", id);
}
</script>
<template>
  <div class="border border-outline-outline divide-y-1 divide-outline-outline">
    <div
      v-for="paymentMethod in paymentMethods"
      :key="paymentMethod.id"
      class="p-4"
    >
      <label :for="paymentMethod.id" class="flex items-center gap-4">
        <div>
          <FormRadioButton
            :selected="selectedPaymentMethod === paymentMethod.id"
            :id="paymentMethod.id"
            :value="paymentMethod.id"
            name="payment-method"
            v-model="selectedPaymentMethod"
            @change="handleChange(paymentMethod.id)"
          />
        </div>
        <div>
          <div class="text-surface-on-surface">
            {{ paymentMethod.translated.name }}
          </div>

          <div
            v-if="paymentMethod.description"
            class="self-stretch text-surface-on-surface-variant text-sm leading-[21px]"
          >
            {{ paymentMethod.description }}
          </div>
        </div>
        <div class="ml-auto">
          <NuxtImg :src="getPaymentMethodIcon(paymentMethod)" height="32" />
        </div>
      </label>
    </div>
  </div>
</template>
