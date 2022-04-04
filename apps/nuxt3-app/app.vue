<script setup lang="ts">
import { useSessionContext, useUser, useCart } from "@shopware-pwa/composables";
definePageMeta({
  key: (route) => route.fullPath,
});

const { refreshSessionContext } = useSessionContext();
const { refreshUser } = useUser();
const { refreshCart } = useCart();

onMounted(() => {
  refreshSessionContext();
  refreshUser();
  refreshCart();
});

const isSidebarOpen = ref(false);
provide("isSidebarOpen", isSidebarOpen);
</script>

<template>
  <div>
    <SwModal />
    <SwHeader />
    <NuxtPage />
    <SwSideCart />
  </div>
</template>

<style>
h2 {
  @apply text-4xl py-4;
}
</style>
