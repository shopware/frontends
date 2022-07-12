<script lang="ts">
export default {
  name: "DefaultLayout",
};
</script>
<script setup lang="ts">
// Navigation for default theme
const { loadNavigationElements } = useNavigation();
const { data } = await useAsyncData("mainNavigation", () => {
  return loadNavigationElements({ depth: 2 });
});
provide("swNavigation", data);
</script>
<template>
  <div>
    <SwModal />
    <SwHeader />
    <SwNotifications />
    <div class="mx-auto">
      <SwBreadcrumbs />
      <slot />
    </div>
    <SwSideCart />
  </div>
</template>
