<script setup lang="ts">
import { computed } from "vue";
import { useContentFactory } from "~/composables/useContentFactory";
import type { ButtonProperties } from "~/composables/useContentProperties";
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

// Declarative component setup using factory
const setup = useContentFactory<ButtonProperties>(
  {
    properties: {
      text: { default: "" },
      url: { default: "" },
      newTab: { default: false },
      variant: { default: "primary" },
      size: { default: "medium" },
      alignment: { default: "left" },
    },
    classMappers: {
      variant: BUTTON_VARIANT_CLASSES,
      size: SIZE_CLASSES,
      alignment: ALIGNMENT_FLEX_CLASSES,
    },
  },
  props.properties,
);

// Destructure for easy access
const { text, url, newTab, variant, size, alignment } = setup.props;

// Only define truly computed values
const linkTarget = computed(() => (newTab ? "_blank" : "_self"));
const linkRel = computed(() => (newTab ? "noopener noreferrer" : undefined));
const isExternal = computed(() =>
  url ? url.startsWith("http://") || url.startsWith("https://") : false,
);
</script>

<template>
  <div class="content-button flex" :class="setup.getClass('alignment')">
    <component
      :is="url ? (isExternal ? 'a' : 'NuxtLink') : 'button'"
      :href="isExternal ? url : undefined"
      :to="!isExternal && url ? url : undefined"
      :target="linkTarget"
      :rel="linkRel"
      class="inline-flex items-center justify-center font-medium rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      :class="setup.getClasses('variant', 'size')"
    >
      {{ text }}
      <slot />
    </component>
  </div>
</template>
