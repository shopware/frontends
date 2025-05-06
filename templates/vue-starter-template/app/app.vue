<script setup lang="ts">
import type { Schemas } from "#shopware";

const { apiClient } = useShopwareContext();
const sessionContextData = ref<Schemas["SalesChannelContext"]>();
const contextResponse = await apiClient.invoke("readContext get /context");
sessionContextData.value = contextResponse.data;

useSessionContext(sessionContextData.value);
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
