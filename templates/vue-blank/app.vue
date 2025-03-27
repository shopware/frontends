<script setup lang="ts">
const { pushBreadcrumb, breadcrumbs } = useBreadcrumbs();
// pushBreadcrumb({
//   name: "Home",
//   path: "/",
// });

const { navigationElements, loadNavigationElements } = useNavigation();

await loadNavigationElements({});

provideCartSidebar();
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <LayoutTopMenu />
    <LayoutTopHeader />
    <LayoutNavigationMenu :navigationElements="navigationElements" />
    <main class="flex-1 bg-surface-surface">
      <div><LayoutBreadcrumbs v-if="breadcrumbs?.length" :breadcrumbs="breadcrumbs" /></div>
      <NuxtPage />
    </main>
    <CartSidebar :initialItems="[]" />
  </div>
</template>
