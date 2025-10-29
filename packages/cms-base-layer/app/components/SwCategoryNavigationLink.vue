<script setup lang="ts">
import {
  buildUrlPrefix,
  getCategoryRoute,
  getTranslatedProperty,
  urlIsAbsolute,
} from "@shopware/helpers";
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useUrlResolver } from "#imports";
import type { Schemas } from "#shopware";

interface Props {
  navigationElement: Schemas["Category"];
  isActive?: boolean;
  isExpanded?: boolean;
  level?: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  toggle: [];
}>();

const { getUrlPrefix } = useUrlResolver();
const url = computed(() => {
  return buildUrlPrefix(
    getCategoryRoute(props.navigationElement),
    getUrlPrefix(),
  );
});

const hasChildren = computed(() => {
  return (
    props.navigationElement.children &&
    props.navigationElement.children.length > 0
  );
});
</script>
<template>
  <!-- Level 1 Category (Top-level with border and toggle) -->
  <div
    v-if="props.level === 0"
    class="self-stretch flex flex-col justify-center items-center"
  >
    <div class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-start items-center gap-1">
      <div class="flex-1 flex justify-start items-center gap-2.5">
        <RouterLink
          v-if="!urlIsAbsolute(url.path)"
          :to="url"
          :class="[
            'flex-1 justify-start text-surface-on-surface text-base leading-normal font-bold',
          ]"
        >
          {{ getTranslatedProperty(navigationElement, "name") }}
        </RouterLink>
        <a
          v-else
          :href="url.path"
          :class="[
            'flex-1 justify-start text-surface-on-surface text-base leading-normal font-bold',
          ]"
          :target="
            navigationElement.externalLink || navigationElement.linkNewTab
              ? '_blank'
              : ''
          "
        >
          {{ getTranslatedProperty(navigationElement, "name") }}
        </a>
      </div>
      <button
        v-if="hasChildren"
        @click="emit('toggle')"
        class="w-6 h-6 relative flex items-center justify-center bg-transparent cursor-pointer focus:outline-none"
        type="button"
        :aria-label="props.isExpanded ? 'Collapse' : 'Expand'"
      >
        <SwChevronIcon :direction="props.isExpanded ? 'up' : 'down'" :size="20" />
      </button>
    </div>
  </div>

  <!-- Level 2+ Categories (Nested with left padding) -->
  <div
    v-else
    class="self-stretch flex flex-col justify-center items-center"
  >
    <div class="self-stretch pl-4 py-1.5 inline-flex justify-start items-center gap-2">
      <div class="py-0.5 flex-1 flex justify-start items-center gap-2.5">
        <RouterLink
          v-if="!urlIsAbsolute(url.path)"
          :to="url"
          :class="[
            'justify-start text-surface-on-surface text-base leading-normal',
            props.isActive ? 'font-bold' : 'font-normal',
          ]"
        >
          {{ getTranslatedProperty(navigationElement, "name") }}
        </RouterLink>
        <a
          v-else
          :href="url.path"
          :class="[
            'justify-start text-surface-on-surface text-base leading-normal',
            props.isActive ? 'font-bold' : 'font-normal',
          ]"
          :target="
            navigationElement.externalLink || navigationElement.linkNewTab
              ? '_blank'
              : ''
          "
        >
          {{ getTranslatedProperty(navigationElement, "name") }}
        </a>
      </div>
      <button
        v-if="hasChildren"
        @click="emit('toggle')"
        class="w-6 h-6 relative flex items-center justify-center bg-transparent cursor-pointer focus:outline-none"
        type="button"
        :aria-label="props.isExpanded ? 'Collapse' : 'Expand'"
      >
        <SwChevronIcon :direction="props.isExpanded ? 'up' : 'down'" :size="20" />
      </button>
    </div>
  </div>
</template>
