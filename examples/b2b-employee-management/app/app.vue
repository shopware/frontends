<script setup lang="ts">
import "~/assets/css/styles.css";

const { refreshSessionContext } = useSessionContext();
refreshSessionContext();
</script>
<template>
  <NuxtLayout>
    <div test-id="test-wrapper">
      <!-- <NuxtNotifications position="top right" :speed="500" /> -->
      <div class="container mx-auto px-4">
        <h1>B2B Employee Management - example</h1>
      </div>

      <NuxtPage />
    </div>
  </NuxtLayout>
</template>
