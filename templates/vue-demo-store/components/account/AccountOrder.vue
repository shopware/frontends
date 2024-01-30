<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  order: Schemas["Order"];
}>();

const isExpand = ref(false);
const { t } = useI18n();
const toggleView = () => (isExpand.value = !isExpand.value);
const { currency } = useSessionContext();

const orderDate = computed(() =>
  new Date(props.order.orderDate).toLocaleDateString(
    (typeof navigator !== "undefined" && navigator.language) || "en-US",
  ),
);
</script>

<script lang="ts">
export default {
  name: "AccountOrder",
};
</script>

<template>
  <div class="border border-secondary-200 mb-8 rounded">
    <AccountOrderSummary>
      <div class="lg:col-span-2 text-secondary-600">
        {{ order.orderNumber }}
      </div>
      <div class="text-secondary-600">
        {{ order.amountTotal }} {{ currency?.symbol }}
      </div>
      <div class="text-secondary-600">{{ orderDate }}</div>
      <div class="text-secondary-600">{{ order.stateMachineState.name }}</div>
      <div
        class="hidden sm:block justify-self-end text-dark cursor-pointer"
        @click="toggleView"
      >
        {{ !isExpand ? t("account.view") : t("account.hide") }}
      </div>
    </AccountOrderSummary>
    <div>
      <div
        class="block sm:hidden text-center text-dark cursor-pointer bg-secondary py-2"
        :aria-expanded="isExpand"
        @click="toggleView"
      >
        {{ !isExpand ? t("account.view") : t("account.hide") }}
      </div>
    </div>
    <AccountOrderDetails v-if="isExpand" :order-id="order.id" />
  </div>
</template>
