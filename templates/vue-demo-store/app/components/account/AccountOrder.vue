<script setup lang="ts">
import type { Schemas } from "#shopware";

defineOptions({
  name: "AccountOrder",
});

const props = defineProps<{
  order: Schemas["Order"];
}>();

const { t } = useI18n();
const { currency } = useSessionContext();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const orderDate = computed(() =>
  new Date(props.order.orderDate).toLocaleDateString(
    (typeof navigator !== "undefined" && navigator.language) || "en-US",
  ),
);
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
      <div class="text-secondary-600">
        <AccountOrderStatus
          v-if="order.stateMachineState"
          :state="order.stateMachineState"
        />
      </div>
      <div class="hidden sm:block justify-self-end text-dark cursor-pointer">
        <NuxtLink :to="formatLink(`/account/order/details/${order.id}`)">
          {{ t("account.view") }}
        </NuxtLink>
      </div>
    </AccountOrderSummary>
    <div>
      <div
        class="block sm:hidden text-center text-dark cursor-pointer bg-secondary py-2"
      >
        <NuxtLink :to="formatLink(`/account/order/details/${order.id}`)">
          {{ t("account.view") }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
