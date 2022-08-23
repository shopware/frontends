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
provide("swNavigation-main-navigation", data);

const { loadNavigationElements: loadFooterNavigationElements } = useNavigation({
  type: "footer-navigation",
});
const { data: footerData } = await useAsyncData("mainFooterNavigation", () => {
  return loadFooterNavigationElements({ depth: 2 });
});
provide("swNavigation-footer-navigation", footerData);
</script>
<template>
  <div>
    <SharedModal />
    <LayoutHeader />
    <LayoutNotifications />
    <div class="mx-auto">
      <LayoutBreadcrumbs />
      <slot />
    </div>
    <CheckoutSideCart />
    <LayoutFooter />
  </div>
</template>
