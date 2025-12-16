<script setup lang="ts">
import { computed } from "vue";
import { getElementProperty } from "~/composables/contentHelpers";
import type { Schemas } from "#shopware";

const props = defineProps<{
  element: Schemas["ContentElement"];
  properties: Record<string, unknown>;
}>();

const text = computed(() =>
  getElementProperty<string>(props.element, "text", ""),
);
const url = computed(() =>
  getElementProperty<string>(props.element, "url", ""),
);
const newTab = computed(() =>
  getElementProperty<boolean>(props.element, "newTab", false),
);
const variant = computed(() =>
  getElementProperty<"primary" | "secondary" | "outline" | "ghost">(
    props.element,
    "variant",
    "primary",
  ),
);
const size = computed(() =>
  getElementProperty<"small" | "medium" | "large">(
    props.element,
    "size",
    "medium",
  ),
);
const alignment = computed(() =>
  getElementProperty<"left" | "center" | "right">(
    props.element,
    "alignment",
    "left",
  ),
);

const variantClass = computed(() => {
  const variantMap: Record<string, string> = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white border-transparent",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white border-transparent",
    outline: "bg-transparent hover:bg-gray-50 text-gray-900 border-gray-300",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-900 border-transparent",
  };
  return variantMap[variant.value as string] || variantMap.primary;
});

const sizeClass = computed(() => {
  const sizeMap: Record<string, string> = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };
  return sizeMap[size.value as string] || sizeMap.medium;
});

const alignmentClass = computed(() => {
  const alignMap: Record<string, string> = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };
  return alignMap[alignment.value as string] || "justify-start";
});

const linkTarget = computed(() => (newTab.value ? "_blank" : "_self"));
const linkRel = computed(() =>
  newTab.value ? "noopener noreferrer" : undefined,
);

const isExternal = computed(() => {
  return (
    url.value &&
    (url.value.startsWith("http://") || url.value.startsWith("https://"))
  );
});
</script>

<template>
  <div class="content-button flex" :class="alignmentClass">
    <component
      :is="url ? (isExternal ? 'a' : 'NuxtLink') : 'button'"
      :href="isExternal ? url : undefined"
      :to="!isExternal && url ? url : undefined"
      :target="linkTarget"
      :rel="linkRel"
      class="inline-flex items-center justify-center font-medium rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      :class="[variantClass, sizeClass]"
    >
      {{ text }}

      <!-- Slot for icon or additional content -->
      <slot />
    </component>
  </div>
</template>
