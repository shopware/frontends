<script setup lang="ts">
const route = useRoute();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const { order } = useOrderDetails(route.params.id as string);

const pageTitle = computed(
  () => `${$t("account.orderDetails.order")} #${order.value?.orderNumber}`,
);
</script>

<template>
  <NuxtLayout name="account">
    <div class="mb-20">
      <p class="mb-2">
        <NuxtLink
          class="text-sm flex flex-row gap-1 text-surface-on-surface hover:text-brand-primary"
          :to="formatLink('/account/order')"
        >
          <div class="w-5 h-5 i-carbon-chevron-left" />
          {{ $t("account.orderDetails.backToOrdersList") }}</NuxtLink
        >
      </p>
      <AccountPageHeader class="mb-14" :title="pageTitle" />

      <AccountOrderDetailView :order-id="(route.params.id as string)" />
    </div>
  </NuxtLayout>
</template>
