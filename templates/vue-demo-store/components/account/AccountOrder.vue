<script setup lang="ts">
import { Order } from "@shopware-pwa/types";

const props = defineProps<{
  order: Order;
}>();

const isExpand = ref(false);

const toggleView = () => (isExpand.value = !isExpand.value);
const { currency } = useSessionContext();

const orderDate = computed(() =>
  new Date(props?.order?.orderDate).toLocaleDateString(
    (typeof navigator !== "undefined" && navigator.language) || "en-US"
  )
);
</script>

<script lang="ts">
export default {
  name: "AccountOrder",
};
</script>

<template>
  <div class="border border-gray-200 mb-8 rounded">
    <AccountOrderSummary>
      <div class="col-span-2">{{ order.orderNumber }}</div>
      <div>{{ order.amountTotal }} {{ currency?.symbol }}</div>
      <div>{{ orderDate }}</div>
      <div
        @click="toggleView"
        class="justify-self-end text-brand-dark cursor-pointer"
        :aria-expanded="isExpand"
      >
        View
      </div>
    </AccountOrderSummary>

    <AccountOrderDetails v-if="isExpand" :orderId="order.id" />
  </div>
</template>
