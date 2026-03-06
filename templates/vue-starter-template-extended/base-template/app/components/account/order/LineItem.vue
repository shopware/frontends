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
    case "promotion":
      return defineAsyncComponent(() => import("./LineItemPromotion.vue"));
    case "credit":
      return defineAsyncComponent(() => import("./LineItemCredit.vue"));
    case "custom":
      return defineAsyncComponent(() => import("./LineItemCustom.vue"));
    default:
      return defineAsyncComponent(() => import("./LineItemProduct.vue"));
  }
});
</script>
<template>
  <LineItemType :line-item="lineItem" />
</template>
