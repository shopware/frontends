<script setup lang="ts">
const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Furniture", path: "/furniture" },
  { name: "Chairs", path: "/furniture/chairs" },
  { name: "Wooden Chair", path: "" },
];
</script>

<template>
  <div class="flex min-h-screen flex-col x">
    <LayoutTopMenu/>
    <LayoutTopHeader />
    <LayoutNavigationMenu />
    <main class="flex-1">
      <LayoutBreadcrumbs :breadcrumbs="breadcrumbs" />
      <ProductProductDetailPage />
    </main>
    </div>
</template>
