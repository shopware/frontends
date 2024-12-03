<script setup lang="ts">
import "~/assets/css/styles.css";
const { isLoggedIn } = useUser();

const { refreshSessionContext } = useSessionContext();
refreshSessionContext();
</script>
<template>
  <NuxtLayout>
    <div class="container mx-auto px-4">
      <h1>B2B Employee Management - example</h1>
    </div>

    <NuxtPage />
  </NuxtLayout>
</template>
