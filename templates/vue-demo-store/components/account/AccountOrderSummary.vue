<script lang="ts">
export default {
  name: "AccountOrderSummary",
};
</script>

<template>
  <div class="bg-secondary bg-opacity-75 px-2 py-4 flex sm:block gap-10">
    <div
      class="flex flex-col sm:grid grid-cols-5 lg:grid-cols-6 gap-y-5 gap-x-7"
    >
      <div class="lg:col-span-2">{{ $t("account.order.orderNumber") }}</div>
      <div>{{ $t("account.order.totalAmount") }}</div>
      <div>{{ $t("account.order.orderDate") }}</div>
      <div>{{ $t("account.order.orderStatus") }}</div>
      <div class="justify-self-end" />
    </div>

    <div
      class="flex flex-col sm:grid grid-cols-5 lg:grid-cols-6 gap-y-5 gap-x-7 text-secondary-400"
    >
      <slot />
    </div>
  </div>
</template>
