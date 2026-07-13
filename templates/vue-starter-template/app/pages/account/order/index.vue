<script setup lang="ts">
const { apiClient } = useShopwareContext();
const orderAssociations = useDefaultOrderAssociations();

const fetchOrders = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const { data } = await apiClient.invoke("readOrder post /order", {
    body: {
      page,
      limit,
      checkPromotion: true,
      associations: orderAssociations,
      "total-count-mode": "exact",
      sort: [{ field: "createdAt", order: "DESC" }],
    },
  });

  return {
    elements: data.orders.elements ?? [],
    total: data.orders.total ?? 0,
  };
};
</script>
<template>
  <NuxtLayout name="account">
    <div>
      <AccountPageHeader
        class="mb-14"
        :title="$t('account.order.header')"
        :subtitle="$t('account.order.subHeader')"
      />

      <SharedPaginatedList :fetcher="fetchOrders" data-key="account-orders">
        <template #default="{ items }">
          <AccountOrderLine
            v-for="order in items"
            :key="order.id"
            class="mb-4"
            :order="order"
          />
        </template>

        <template #loading="{ limit }">
          <AccountOrderLineSkeleton v-for="n in limit" :key="n" class="mb-4" />
        </template>
      </SharedPaginatedList>
    </div>
  </NuxtLayout>
</template>
