<script setup lang="ts">
const {
  shippingMethods,
  setShippingMethod,
  selectedShippingMethod: shippingMethod,
  getShippingMethods,
} = useCheckout();

const selectedShippingMethod = computed({
  get(): string {
    return shippingMethod.value?.id || "";
  },
  async set(shippingMethodId: string) {
    await setShippingMethod({ id: shippingMethodId });
  },
});
</script>
<template>
  <div v-for="shippingMethod in shippingMethods" :key="shippingMethod.id">
    <input
      :id="shippingMethod.id"
      v-model="selectedShippingMethod"
      :value="shippingMethod.id"
      name="shipping-method"
      type="radio"
    />
    <label :for="shippingMethod.id">
      {{ shippingMethod.name }}
    </label>
  </div>
</template>
