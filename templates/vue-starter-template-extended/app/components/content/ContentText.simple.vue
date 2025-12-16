<script setup lang="ts">
import { computed } from "vue";
import { extractProperties } from "~/composables/useContentFactory";
import type { TextProperties } from "~/composables/useContentProperties";
import {
  ALIGNMENT_TEXT_CLASSES,
  VERTICAL_ALIGNMENT_CLASSES,
} from "~/composables/useContentStyles";
import type { Schemas } from "#shopware";

const props = defineProps<{
  element: Schemas["ContentElement"];
  properties: Record<string, unknown>;
}>();

// Simple extraction with schema
const { title, content, alignment, verticalAlignment } =
  extractProperties<TextProperties>(props.properties, {
    title: { default: "" },
    content: { default: "" },
    alignment: { default: "left" },
    verticalAlignment: { default: "top" },
  });

// Direct class access from shared configs
const alignmentClass = computed(
  () => ALIGNMENT_TEXT_CLASSES[alignment] || ALIGNMENT_TEXT_CLASSES.left,
);

const verticalAlignClass = computed(
  () =>
    VERTICAL_ALIGNMENT_CLASSES[verticalAlignment] ||
    VERTICAL_ALIGNMENT_CLASSES.top,
);
</script>

<template>
  <div
    class="content-text flex flex-col"
    :class="[alignmentClass, verticalAlignClass]"
  >
    <h2 v-if="title" class="text-2xl md:text-3xl font-bold mb-4">
      {{ title }}
    </h2>

    <div
      v-if="content"
      class="prose prose-sm md:prose-base max-w-none"
      v-html="content"
    />

    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>
