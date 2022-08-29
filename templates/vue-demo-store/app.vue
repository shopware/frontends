<script setup lang="ts">
definePageMeta({
  key: (route) => route.fullPath,
});

useHead({
  title: "Shopware Demo store",
  meta: [{ name: "description", content: "Shopware Demo store" }],
  htmlAttrs: {
    lang: "en",
  },
});

const { refreshSessionContext } = useSessionContext();
const { refreshUser } = useUser();
const { refreshCart } = useCart();
useNotifications();
useWishlist();

onMounted(() => {
  refreshSessionContext();
  refreshUser();
  refreshCart();
});

const isSidebarOpen = ref(false);
provide("isSidebarOpen", isSidebarOpen);

const isModalOpened = ref(false);
provide("isModalOpened", isModalOpened);

const isSideMenuOpened = ref(false);
provide("isSideMenuOpened", isSideMenuOpened);
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
h2 {
  @apply text-4xl py-4;
}
</style>
