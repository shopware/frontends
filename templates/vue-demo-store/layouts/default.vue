<script lang="ts">
export default {
  name: "DefaultLayout",
};
</script>
<script setup lang="ts">
const showBreadCrumb = useState<boolean>('showBreadCrumb');

// Canonical
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const headLinks: any = [
  {
    rel: 'canonical',
    href: runtimeConfig.public.shopwareStoreDomain + route.path,
  },
];
useHead({
  link: headLinks
});

</script>
<template>
  <div>
    <LayoutHeader />
    <LayoutNotifications />
    <div class="min-h-[100vh] mx-auto">
      <LayoutBreadcrumbs v-if="showBreadCrumb" />
      <slot />
    </div>
    <LayoutFooter />
  </div>
</template>
