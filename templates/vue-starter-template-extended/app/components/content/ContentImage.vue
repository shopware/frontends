<script setup lang="ts">
import { computed } from "vue";
import { extractProperties } from "~/composables/useContentFactory";
import type { ImageProperties } from "~/composables/useContentProperties";
import { IMAGE_DISPLAY_MODE_CLASSES } from "~/composables/useContentStyles";
import type { Schemas } from "#shopware";

const props = defineProps<{
  element: Schemas["ContentElement"];
  properties: Record<string, unknown>;
}>();

// Type-safe property extraction
const { media, url, alt, title, displayMode, minHeight, newTab } =
  extractProperties<ImageProperties>(props.properties, {
    media: { default: undefined },
    url: { default: "" },
    alt: { default: "" },
    title: { default: "" },
    displayMode: { default: "standard" },
    minHeight: { default: "" },
    newTab: { default: false },
  });

const imageUrl = computed(() => {
  return media?.url || url || "";
});

// Use shared style configuration
const displayModeClass = computed(
  () =>
    IMAGE_DISPLAY_MODE_CLASSES[displayMode] ||
    IMAGE_DISPLAY_MODE_CLASSES.standard,
);

const containerClass = computed(() => {
  const classes = ["content-image", "relative", "w-full"];

  if (displayMode === "cover" && minHeight) {
    classes.push("flex items-center justify-center");
  }

  return classes;
});

const imageClass = computed(() => {
  const classes = ["w-full", "h-auto"];

  if (displayMode === "cover") {
    classes.push("absolute inset-0 h-full", displayModeClass.value);
  } else {
    classes.push(displayModeClass.value);
  }

  return classes;
});

const imageAlt = computed(() => {
  return alt || media?.alt || title || "Image";
});

const linkTarget = computed(() => (newTab ? "_blank" : "_self"));
</script>

<template>
  <div
    :class="containerClass"
    :style="minHeight ? { minHeight } : undefined"
  >
    <component
      :is="url ? 'a' : 'div'"
      v-if="imageUrl"
      :href="url || undefined"
      :target="url ? linkTarget : undefined"
      :rel="url && newTab ? 'noopener noreferrer' : undefined"
      class="block w-full"
    >
      <NuxtImg
        :src="imageUrl"
        :alt="imageAlt"
        :title="title"
        :class="imageClass"
        loading="lazy"
      />
    </component>

    <!-- Fallback if no image -->
    <div
      v-else
      class="bg-gray-200 flex items-center justify-center"
      :style="minHeight ? { minHeight } : { minHeight: '300px' }"
    >
      <span class="text-gray-400 text-sm">No image</span>
    </div>

    <!-- Slot for overlay content -->
    <div v-if="$slots.default" class="absolute inset-0 flex items-center justify-center">
      <slot />
    </div>
  </div>
</template>
