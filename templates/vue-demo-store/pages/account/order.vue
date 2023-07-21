<script setup lang="ts">
import SharedAlert from "../../components/shared/SharedAlert.vue";
import SharedOrders from "../../components/shared/SharedOrders.vue";

definePageMeta({
  layout: "account",
});

const { orders, loadOrders } = useCustomerOrders();
const isLoading = ref(true);
useBreadcrumbs([
  {
    name: "My Account",
    path: "/account",
  },
  {
    name: "Order",
    path: "/account/order",
  },
]);

onMounted(async () => {
  if (orders?.value && Object.keys(orders.value).length === 0) {
    await loadOrders();
  }
  isLoading.value = false;
});
</script>

<script lang="ts">
export default {
  name: "OrderHistory",
};
</script>

<template>
  <section class="flex flex-col space-y-10 mb-24">
    <section>
      <h3 class="mb-4">
        {{ $t('orders') }}
      </h3>
      <p class="text-base">
        {{ $t('your_recent_orders') }}:
      </p>
    </section>
    <div
      v-if="isLoading"
      class="w-full h-full"
    >
      <div class="flex animate-pulse flex-col items-top h-full space-y-5">
        <div class="w-full flex flex-row space-x-6">
          <div class="w-1/6 bg-gray-300 h-15 rounded-md" />
          <div class="w-1/6 bg-gray-300 h-15 rounded-md" />
          <div class="w-1/2 bg-gray-200 h-15 rounded-md" />
          <div class="w-1/6 bg-gray-300 h-15 rounded-md" />
        </div>
      </div>
    </div>
    <section v-else>
      <SharedAlert
        v-if="!orders?.length"
        text="You currently have no order history."
      />
      <SharedOrders
        v-else
        :orders="orders || []"
      />
    </section>
  </section>
</template>
