<script setup lang="ts">
definePageMeta({
  key: (route) => route.fullPath,
});
</script>

<template>
  <div>
    <SwHeader />
    <NuxtPage />
  </div>
</template>

<style>
h2 {
  @apply text-4xl py-4;
}
</style>
