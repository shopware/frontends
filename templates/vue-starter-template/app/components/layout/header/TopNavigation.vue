<script setup lang="ts">
import { getCategoryRoute, getTranslatedProperty } from "@shopware/helpers";

const currentMenuPosition = defineModel<string | undefined>(
  "currentMenuPosition",
);

const { navigationElements } = useNavigation();

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const route = useRoute();
</script>

<template>
  <nav aria-label="Main navigation">
    <ul role="menubar" class="flex gap-8">
      <li
        v-for="(navigationElement, index) in navigationElements"
        :key="navigationElement.id"
        role="none"
        class="text-surface-on-surface border-b hover:border-surface-on-surface border-transparent has-[.router-link-active]:border-surface-on-surface"
        @mouseover="currentMenuPosition = navigationElement.id"
        @focusin="currentMenuPosition = navigationElement.id"
      >
        <NuxtLink
          role="menuitem"
          :aria-haspopup="navigationElement.children?.length ? 'true' : undefined"
          :aria-expanded="
            navigationElement.children?.length
              ? currentMenuPosition === navigationElement.id
              : undefined
          "
          :aria-current="
            route.path === formatLink(getCategoryRoute(navigationElement))
              ? 'page'
              : undefined
          "
          :target="
            navigationElement.externalLink || navigationElement.linkNewTab
              ? '_blank'
              : ''
          "
          :to="formatLink(getCategoryRoute(navigationElement))"
          @click="currentMenuPosition = undefined"
        >
          {{ getTranslatedProperty(navigationElement, "name") }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
