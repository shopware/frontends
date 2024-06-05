<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = withDefaults(
  defineProps<{
    cartItem: Schemas["LineItem"];
    maxQty?: number;
    // eslint-disable-next-line vue/require-default-prop
    controller?: ReturnType<typeof useModal>;
  }>(),
  {
    maxQty: 100,
  },
);

const { cartItem, controller } = toRefs(props);
const CartItem = computed(() => {
  switch (cartItem.value?.type) {
    default:
    case "product":
      return defineAsyncComponent(() => import("./cart/ProductItem.vue"));
    case "promotion":
      return defineAsyncComponent(() => import("./cart/PromotionItem.vue"));
  }
});
</script>

<template>
  <component :is="CartItem" :cart-item="cartItem" :controller="controller" />
</template>
