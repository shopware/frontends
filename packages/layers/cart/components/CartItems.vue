<script setup lang="ts">
import { useBreadcrumbs, useCart } from "@shopware/composables";
import { computed, onMounted, ref } from "vue";

// Create and provide the cart sidebar state
const { clearBreadcrumbs } = useBreadcrumbs();
clearBreadcrumbs();
// Use the Shopware cart composable to access cart data and methods
const { cart, refreshCart, removeItem, changeProductQuantity } = useCart();

// Fetch cart data when component mounts
onMounted(async () => {
  if (!cart.value) {
    await refreshCart();
  }
});

// Computed properties for cart data
const items = computed(() => cart.value?.lineItems || []);

// Handle cart item operations
const handleQuantityChange = async (itemId: string, quantity: number) => {
  await changeProductQuantity({
    id: itemId,
    quantity: quantity,
  });
};

const handleRemoveItem = async (itemId: string) => {
  await removeItem({ id: itemId });
};
</script>

<template>
  <div class="divide-y divide-outline-outline-variant w-full">
    <CartItem v-for="item in items" :key="item.id" :item="item" @quantity-change="handleQuantityChange"
      @remove="handleRemoveItem" />
  </div>
</template>