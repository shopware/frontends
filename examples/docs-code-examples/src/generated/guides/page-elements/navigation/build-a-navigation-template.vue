<script setup lang="ts">
import { getCategoryRoute } from "@shopware/helpers";

import { useNavigation } from "#imports";
const { loadNavigationElements, navigationElements } = useNavigation();
await loadNavigationElements({ depth: 2 });
</script>

<template>
  <ul>
    <li
      v-for="navigationElement in navigationElements ?? []"
      :key="navigationElement.id"
    >
      <RouterLink
        :to="getCategoryRoute(navigationElement)"
        :target="
          navigationElement.externalLink || navigationElement.linkNewTab
            ? '_blank'
            : ''
        "
      >
        {{ navigationElement.translated.name }}
      </RouterLink>
    </li>
  </ul>
</template>
