<script setup lang="ts">
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
