<script setup lang="ts">
import { useSessionContext } from "@shopware-pwa/composables-next/dist";

const { refreshSessionContext, sessionContext } = useSessionContext();
refreshSessionContext();
</script>
<template>
  <div test-id="test-wrapper">
    <h1
      class="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"
    >
      <span
        class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400"
        >Session</span
      >
      context
    </h1>
    <pre>{{ sessionContext }}</pre>
  </div>
</template>
