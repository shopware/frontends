<script setup lang="ts">
const {
  paymentMethods,
  selectedPaymentMethod: paymentMethod,
  setPaymentMethod,
} = useCheckout();

const selectedPaymentMethod = computed({
  get(): string {
    return paymentMethod.value?.id || "";
  },
  async set(paymentMethodId: string) {
    await setPaymentMethod({ id: paymentMethodId });
  },
});
</script>
<template>
  <div v-for="paymentMethod in paymentMethods" :key="paymentMethod.id">
    <input
      :id="paymentMethod.id"
      v-model="selectedPaymentMethod"
      :value="paymentMethod.id"
      name="payment-method"
      type="radio"
    />
    <label :for="paymentMethod.id">
      {{ paymentMethod.name }}
    </label>
  </div>
</template>
