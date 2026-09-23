<script setup lang="ts">
import { getCategoryRoute } from "@shopware/helpers";
</script>

<template>
  <NuxtLink :to="getCategoryRoute(navigationChild)">
    {{ getTranslatedProperty(navigationChild, "name") }}
  </NuxtLink>
</template>
