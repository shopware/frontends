<script setup lang="ts">
import Frontends from "./components/Frontends.vue";
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
  <div id="app">
    <Frontends template="Blank Vue 3 template (Nuxt)" />
  </div>
</template>
<style>
@import "./style.css";
</style>
