<script setup lang="ts">
definePageMeta({
  layout: "account",
});

const { orders, loadOrders } = useCustomerOrders();

await useAsyncData("getOrders", () => {
  return loadOrders();
});
</script>

<script lang="ts">
export default {
  name: "OrderHistory",
};
</script>

<template>
  <div class="container mx-auto my-6">
    <h1 class="text-2xl mb-10">Order history</h1>
    <SwOrder v-for="order in orders" :key="order.id" :order="order" />
  </div>
</template>
