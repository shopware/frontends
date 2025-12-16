<script setup lang="ts">
import { computed } from "vue";
import { getElementProperty } from "~/composables/contentHelpers";
import type { Schemas } from "#shopware";

const props = defineProps<{
  element: Schemas["ContentElement"];
  properties: Record<string, unknown>;
}>();

const media = computed(() =>
  getElementProperty<Schemas["Media"]>(props.element, "media"),
);
const url = computed(() =>
  getElementProperty<string>(props.element, "url", ""),
);
const alt = computed(() =>
  getElementProperty<string>(props.element, "alt", ""),
);
const title = computed(() =>
  getElementProperty<string>(props.element, "title", ""),
);
const displayMode = computed(() =>
  getElementProperty<"standard" | "cover" | "contain" | "auto">(
    props.element,
    "displayMode",
    "standard",
  ),
);
const minHeight = computed(() =>
  getElementProperty<string>(props.element, "minHeight", ""),
);
const newTab = computed(() =>
  getElementProperty<boolean>(props.element, "newTab", false),
);

const imageUrl = computed(() => {
  return media.value?.url || url.value || "";
});

const displayModeClass = computed(() => {
  const modeMap: Record<string, string> = {
    standard: "object-cover",
    cover: "object-cover",
    contain: "object-contain",
    auto: "object-scale-down",
  };
  return modeMap[displayMode.value as string] || "object-cover";
});

const containerClass = computed(() => {
  const classes = ["content-image", "relative", "w-full"];

  if (displayMode.value === "cover" && minHeight.value) {
    classes.push("flex items-center justify-center");
  }

  return classes;
});

const imageClass = computed(() => {
  const classes = ["w-full", "h-auto"];

  if (displayMode.value === "cover") {
    classes.push("absolute inset-0 h-full", displayModeClass.value);
  } else {
    classes.push(displayModeClass.value);
  }

  return classes;
});

const imageAlt = computed(() => {
  return alt.value || media.value?.alt || title.value || "Image";
});

const linkTarget = computed(() => (newTab.value ? "_blank" : "_self"));
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
