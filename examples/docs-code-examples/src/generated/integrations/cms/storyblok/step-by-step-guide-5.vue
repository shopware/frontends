<script setup lang="ts">
import { onMounted, useSessionContext } from "#imports";
const { refreshSessionContext } = useSessionContext();

onMounted(async () => {
  await refreshSessionContext();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<style>
@import "./style.css";
</style>
