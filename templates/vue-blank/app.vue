<script setup lang="ts">
const { refreshSessionContext, currency } = useSessionContext();
// const { refreshUser } = useUser();
// const { refreshCart } = useCart();
// useNotifications();
// useWishlist();

onMounted(() => {
  refreshSessionContext();
  // refreshUser();
  // refreshCart();
});
</script>

<template>
  <div>
    <h1>Hello it's your blank template for Shopware</h1>
    <div>Our currency - {{ currency?.symbol }}</div>
  </div>
</template>
