<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const {
  orders,
  loadOrders,
  changeCurrentPage,
  totalPages,
  currentPage,
  limit,
} = useCustomerOrders();

const defaultLimit = 15;
const defaultPage = 1;

await useAsyncData("getOrders", () => {
  return loadOrders({
    limit: limit.value,
    page: route.query.p ? Number(route.query.p) : defaultPage,
    checkPromotion: true,
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
  <NuxtLayout name="account">
    <div>
      <AccountPageHeader
        class="mb-14"
        :title="$t('account.order.header')"
        :subtitle="$t('account.order.subHeader')"
      />

      <AccountOrderLine
        class="mb-4"
        v-for="order in orders"
        :key="order.id"
        :order="order"
      />
    </div>
  </NuxtLayout>
</template>
