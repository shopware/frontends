<script setup lang="ts">
import { computed } from "vue";
import {
  type ButtonProperties,
  useContentProperties,
} from "~/composables/useContentProperties";
import {
  ALIGNMENT_FLEX_CLASSES,
  BUTTON_VARIANT_CLASSES,
  SIZE_CLASSES,
} from "~/composables/useContentStyles";
import type { Schemas } from "#shopware";

const props = defineProps<{
  element: Schemas["ContentElement"];
  properties: Record<string, unknown>;
}>();

// Type-safe property extraction
const { get } = useContentProperties<ButtonProperties>(props.properties);

const text = get("text", "");
const url = get("url", "");
const newTab = get("newTab", false);
const variant = get("variant", "primary");
const size = get("size", "medium");
const alignment = get("alignment", "left");

// Computed classes using shared configurations
const variantClass = computed(
  () => BUTTON_VARIANT_CLASSES[variant] || BUTTON_VARIANT_CLASSES.primary,
);

const sizeClass = computed(() => SIZE_CLASSES[size] || SIZE_CLASSES.medium);

const alignmentClass = computed(
  () => ALIGNMENT_FLEX_CLASSES[alignment] || ALIGNMENT_FLEX_CLASSES.left,
);

const linkTarget = computed(() => (newTab ? "_blank" : "_self"));
const linkRel = computed(() => (newTab ? "noopener noreferrer" : undefined));

const isExternal = computed(() => {
  return url && (url.startsWith("http://") || url.startsWith("https://"));
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
