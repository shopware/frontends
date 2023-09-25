<script lang="ts">
export default {
  name: "DefaultLayout",
};
</script>
<script setup lang="ts">
// in development mode we test if your API connection is working
if (process.env.NODE_ENV == "development") {
  useConnectionTest();
}

// Navigation for default theme
const { loadNavigationElements } = useNavigation();
const { data } = useAsyncData("mainNavigation", () => {
  return loadNavigationElements({ depth: 2 });
});
provide("swNavigation-main-navigation", data);

const { loadNavigationElements: loadFooterNavigationElements } = useNavigation({
  type: "footer-navigation",
});
const { data: footerData } = useAsyncData("mainFooterNavigation", () => {
  return loadFooterNavigationElements({ depth: 2 });
});
provide("swNavigation-footer-navigation", footerData);
</script>
<template>
  <div>
    <LayoutHeader />
    <LayoutNotifications />
    <div class="mx-auto">
      <slot />
    </div>
    <LayoutFooter />
  </div>
</template>
