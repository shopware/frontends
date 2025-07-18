<script setup lang="ts">
const { refreshSessionContext } = useSessionContext();
refreshSessionContext();
</script>
<template>
  <div>
    <div class="flex flex-col items-center justify-center h-screen">
      <img src="/logo.svg" alt="Logo" class="h-32 w-auto" />
      <p class="text-2xl font-bold text-center text-gray-800 mb-4 block">
        No Maintenance Mode!
      </p>
      <p>
        You should not see this page if the maintenance mode is enabled, and your IP is allowed.
      </p>
    </div>
  </div>
</template>
