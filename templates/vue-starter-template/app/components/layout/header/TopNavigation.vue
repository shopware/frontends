<script setup lang="ts">
import { getCategoryRoute, getTranslatedProperty } from "@shopware/helpers";

const currentMenuPosition = defineModel<string | undefined>(
  "currentMenuPosition",
);

const { navigationElements } = useNavigation();

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
</script>

<template>
  <div>
    <div class="flex gap-8">
      <div
        v-for="(navigationElement, index) in navigationElements"
        :key="navigationElement.id"
        class="text-surface-on-surface border-b hover:border-surface-on-surface border-transparent has-[.router-link-active]:border-surface-on-surface"
        @mouseover="currentMenuPosition = navigationElement.id"
        @focusin="currentMenuPosition = navigationElement.id"
      >
        <NuxtLink
          role="menuitem"
          :target="
            navigationElement.externalLink || navigationElement.linkNewTab
              ? '_blank'
              : ''
          "
          :to="formatLink(getCategoryRoute(navigationElement))"
        >
          {{ getTranslatedProperty(navigationElement, "name") }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
