<script setup lang="ts">
const props = defineProps<{
  orderId: string;
}>();

const {
  loadOrderDetails,
  personalDetails,
  billingAddress,
  shippingAddress,
  order,
} = useOrderDetails(props.orderId);

onMounted(() => {
  loadOrderDetails();
});

const lineItems = computed(() => order.value?.lineItems || []);
</script>

<script lang="ts">
export default {
  name: "AccountOrderDetails",
};
</script>

<template>
  <div v-if="lineItems.length" class="px-2 py-4">
    <div class="grid grid-cols-5 gap-y-10 gap-x-6 pb-4 text-gray-400">
      <div class="col-span-2">Product</div>
      <div>Quantity</div>
      <div>Price</div>
      <div class="justify-self-end text-primary-dark">Subtotal</div>
    </div>

    <AccountOrderLineItem
      v-for="lineItem in lineItems"
      :key="lineItem.identifier"
      :line-item="lineItem"
    />
  </div>
</template>
