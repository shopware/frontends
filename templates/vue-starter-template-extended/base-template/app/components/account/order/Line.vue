<script setup lang="ts">
import type { Schemas } from "#shopware";

const { order } = defineProps<{
  order: Schemas["Order"];
}>();

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const products = computed(
  () => order.lineItems?.filter((element) => element.type === "product") ?? [],
);

const showAllProducts = ref(false);
const { t } = useI18n();

const toggleProducts = () => {
  showAllProducts.value = !showAllProducts.value;
};

const displayedProducts = computed(() => {
  return showAllProducts.value ? products.value : [];
});

const hasProducts = computed(() => products.value.length > 0);
</script>
<template>
  <div class="border border-outline-outline p4">
    <div class="flex justify-between pb-2 border-b border-outline-outline">
      <NuxtLink :to="formatLink(`/account/order/details/${order.id}`)">
        <div class="font-bold">
          {{ t("account.order.orderLabel") }}: {{ order.orderNumber }}
        </div>
      </NuxtLink>

      <AccountOrderStatus
        v-if="order.stateMachineState"
        :state="order.stateMachineState"
      />
    </div>

    <div class="mt-4 flex flex-row w-full">
      <AccountOrderLineData
        v-if="order.orderNumber"
        class="flex-1"
        :label="t('account.order.orderNumber')"
        :value="order.orderNumber"
      />
      <AccountOrderLineData
        class="flex-1"
        :label="t('account.order.shippingStatus')"
        :value="order.stateMachineState.name"
      />
      <AccountOrderLineData
        v-if="order.transactions?.[0]"
        class="flex-1"
        :label="t('account.order.paymentMethod')"
        :value="order.transactions[0].paymentMethod?.translated.name ?? ''"
      />
      <AccountOrderLineData
        v-if="order.deliveries?.[0]"
        class="flex-1"
        :label="t('account.order.shippingMethod')"
        :value="order.deliveries[0].shippingMethod?.translated.name ?? ''"
      />
    </div>
    <div v-if="hasProducts" class="mt-4 mb-2">
      <button
        @click="toggleProducts"
        class="text-brand-primary border-b border-brand-primary inline-flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer bg-transparent text-sm"
      >
        <span>{{
          showAllProducts
            ? t("account.order.seeLess")
            : t("account.order.seeMore")
        }}</span>
        <div
          class="w-4 h-4 i-carbon-chevron-down transition-transform duration-300 ease-in-out"
          :class="{ 'rotate-180': showAllProducts }"
        />
      </button>
    </div>
    <div class="mt-4 overflow-hidden">
      <TransitionGroup
        name="product"
        tag="div"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full"
      >
        <AccountOrderProduct
          v-for="(lineItem, index) in displayedProducts"
          :key="lineItem.id"
          :line-item="lineItem"
          :style="{ '--index': index }"
        />
      </TransitionGroup>
    </div>
    <div class="mt-4">
      <div class="flex justify-between">
        <div class="text-sm text-surface-on-surface-variant">
          {{ t("account.order.subtotal") }}
        </div>
        <div>
          <SharedPrice
            class="text-surface-on-surface text-sm"
            :value="order.amountTotal"
          />
        </div>
      </div>
      <div class="flex justify-between">
        <div class="text-sm text-surface-on-surface-variant">
          {{ t("account.order.shipping") }}
        </div>
        <div>
          <SharedPrice
            class="text-surface-on-surface text-sm"
            :value="order.shippingTotal"
          />
        </div>
      </div>
      <div
        class="border-t border-outline-outline-variant pt-2 mt-2 flex justify-between"
      >
        <div class="text-surface-on-surface">
          {{ t("account.order.total") }}
        </div>
        <div>
          <SharedPrice
            class="text-surface-on-surface"
            :value="order.amountTotal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: calc(var(--index, 0) * 0.08s);
}

.product-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.product-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.product-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.product-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.product-move {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
