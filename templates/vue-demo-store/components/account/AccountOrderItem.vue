<script setup lang="ts">
import type { Schemas } from "#shopware";
import { getMainImageUrl, isProduct } from "@shopware-pwa/helpers-next";

const props = defineProps<{
  orderItem: Schemas["OrderLineItem"];
}>();

const isPromotion = computed(() => isProduct(props.orderItem.payload));
const itemRegularPrice = computed(() => props.orderItem?.unitPrice);
const itemQuantity = computed(() => props.orderItem?.quantity);
const productOptions = computed(() =>
  isProduct(props.orderItem.payload) ? props.orderItem.payload.options : [],
);

const LineItemType = computed(() => {
  switch (props.orderItem.type) {
    case 'product':
      return defineAsyncComponent(
          () => import("./order/LineItemProduct.vue"),
      );
  }

})
</script>

<template>
  <LineItemType :line-item="orderItem" />
</template>
