<script setup lang="ts">
import type { Schemas } from "#shopware";

const { cartItem: cartItemProp, maxQty = 100 } = defineProps<{
  cartItem: Schemas["LineItem"];
  maxQty?: number;
}>();

const cartItem = toRef(() => cartItemProp);
const CartItem = computed(() => {
  switch (cartItem.value?.type) {
    case "promotion":
      return defineAsyncComponent(() => import("./cart/PromotionItem.vue"));
    default:
      return defineAsyncComponent(() => import("./cart/ProductItem.vue"));
  }
});
</script>

<template>
  <component :is="CartItem" :cart-item="cartItem" />
</template>
