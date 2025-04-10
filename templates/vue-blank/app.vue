<script setup lang="ts">
import type { Schemas } from "@shopware/api-client/store-api-types";
const { apiClient } = useShopwareContext();
const sessionContextData = ref<Schemas["SalesChannelContext"]>();
const contextResponse = await apiClient.invoke("readContext get /context");
sessionContextData.value = contextResponse.data;
useSessionContext(sessionContextData.value);
const { pushBreadcrumb, breadcrumbs } = useBreadcrumbs();
// pushBreadcrumb({
//   name: "Home",
//   path: "/",
// });

//await useSessionContext().refreshSessionContext()

const { navigationElements, loadNavigationElements } = useNavigation();

await loadNavigationElements({});
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
