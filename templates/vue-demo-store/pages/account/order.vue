<script setup lang="ts">
defineOptions({
  name: "OrderHistory",
});
definePageMeta({
  layout: "account",
});

const { orders, loadOrders } = useCustomerOrders();
const { t } = useI18n();

useBreadcrumbs([
  {
    name: t("breadcrumbs.accountOverview"),
    path: "/account",
  },
  {
    name: t("breadcrumbs.order"),
    path: "/account/order",
  },
]);

await useAsyncData("getOrders", () => {
  return loadOrders({
    associations: {
      stateMachineState: {},
    },
    sort: [
      {
        field: "createdAt",
        order: "DESC",
      },
    ],
  });
});
</script>

<template>
  <div class="container mx-auto my-8">
    <h1 class="border-b pb-3 text-2xl font-medium text-secondary-900 mb-8">
      {{ $t("account.orderHistoryHeader") }}
    </h1>
    <AccountOrder v-for="order in orders" :key="order.id" :order="order" />
  </div>
</template>
