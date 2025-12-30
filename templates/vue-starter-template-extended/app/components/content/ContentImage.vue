<script setup lang="ts">
import { computed } from "vue";
import { useContentProps } from "~/composables/useContentProps";
import type { ContentComponentProps } from "~/types/content";
import { displayModeClasses } from "~/types/content";
import type { Schemas } from "#shopware";

const props =
  defineProps<ContentComponentProps<Schemas["ContentImageProps"]>>();
const { componentProps, htmlBindings } = useContentProps(props);

// Extract with defaults
const url = componentProps.value.url ?? "";
const alt = componentProps.value.alt ?? "Image";
const title = componentProps.value.title ?? "";
const displayMode = componentProps.value.displayMode ?? "standard";
const minHeight = componentProps.value.minHeight ?? "";

// Merge htmlBindings style with minHeight
const rootStyle = computed(() => ({
  ...htmlBindings.value.style,
  ...(minHeight ? { minHeight } : {}),
}));
</script>

<template>
  <div
    v-bind="htmlBindings"
    :style="rootStyle"
    class="content-image relative w-full"
  >
    <img
      v-if="url"
      :src="url"
      :alt="alt"
      :title="title"
      class="w-full h-auto"
      :class="[
        displayModeClasses[displayMode],
        displayMode === 'cover' ? 'absolute inset-0 h-full' : '',
      ]"
      loading="lazy"
    />

    <div
      v-else
      class="bg-gray-200 flex items-center justify-center rounded"
      :style="{ minHeight: minHeight || '200px' }"
    >
      <span class="text-gray-400 text-sm">No image URL provided</span>
    </div>

    <div
      v-if="$slots.default"
      class="absolute inset-0 flex items-center justify-center"
    >
      <slot />
    </div>
  </div>
</template>
