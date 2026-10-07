<script setup lang="ts">
import { getCategoryRoute } from "@shopware/helpers";

const { loadNavigationElements } = useNavigation();

const { data: mainNavigation } = await useAsyncData("mainNavigation", () =>
  loadNavigationElements({ depth: 2 }),
);

provide("swNavigation-main-navigation", mainNavigation);
</script>

<template>
  <nav aria-label="Main navigation">
    <p v-if="!mainNavigation?.length" role="alert">
      The navigation is not available.
    </p>

    <ul v-else>
      <li v-for="item in mainNavigation" :key="item.id">
        <NuxtLink :to="getCategoryRoute(item)">
          {{ item.translated?.name ?? item.name }}
        </NuxtLink>

        <ul v-if="item.children?.length">
          <li v-for="child in item.children" :key="child.id">
            <NuxtLink :to="getCategoryRoute(child)">
              {{ child.translated?.name ?? child.name }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>

  <slot />
</template>
