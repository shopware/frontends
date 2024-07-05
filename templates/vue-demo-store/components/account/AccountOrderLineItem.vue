<script setup lang="ts">
import type { Schemas } from "#shopware";

defineOptions({
  name: "AccountOrderLineItem",
});

const props = defineProps<{
  lineItem: Schemas["OrderLineItem"];
}>();

const LineItemType = computed(() => {
  switch (props.lineItem.type) {
    default:
    case "product":
      return defineAsyncComponent(() => import("./order/LineItemProduct.vue"));
    case "promotion":
      return defineAsyncComponent(
        () => import("./order/LineItemPromotion.vue"),
      );
    case "credit":
      return defineAsyncComponent(() => import("./order/LineItemCredit.vue"));
    case "custom":
      return defineAsyncComponent(() => import("./order/LineItemCustom.vue"));
  }
});
</script>
<template>
  <LineItemType :line-item="lineItem" />
</template>
