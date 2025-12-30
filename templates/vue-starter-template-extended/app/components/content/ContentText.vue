<script setup lang="ts">
import { useContentProps } from "~/composables/useContentProps";
import type { ContentComponentProps } from "~/types/content";
import { alignmentClasses } from "~/types/content";
import type { Schemas } from "#shopware";

const props = defineProps<ContentComponentProps<Schemas["ContentTextProps"]>>();
const { componentProps, htmlBindings } = useContentProps(props);

// Extract with defaults
const title = componentProps.value.title ?? "";
const content = componentProps.value.content ?? "";
const alignment = componentProps.value.alignment ?? "left";
</script>

<template>
  <div
    v-bind="htmlBindings"
    class="content-text"
    :class="alignmentClasses[alignment]"
  >
    <h2 v-if="title" class="text-2xl md:text-3xl font-bold mb-4">
      {{ title }}
    </h2>

    <div
      v-if="content"
      class="prose prose-sm md:prose-base max-w-none"
      v-html="content"
    />

    <div v-if="$slots.default" class="mt-4">
      <slot />
    </div>
  </div>
</template>
