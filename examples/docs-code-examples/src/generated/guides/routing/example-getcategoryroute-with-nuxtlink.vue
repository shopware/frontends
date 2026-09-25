<script setup lang="ts">
import { getCategoryRoute, getTranslatedProperty } from "@shopware/helpers";

const navigationChild = {
  id: "example-navigation-id",
  name: "Example category",
  type: "page",
  translated: {
    name: "Example category",
  },
  seoUrls: [{ seoPathInfo: "example-category" }],
};
</script>

<template>
  <NuxtLink :to="getCategoryRoute(navigationChild)">
    {{ getTranslatedProperty(navigationChild, "name") }}
  </NuxtLink>
</template>
