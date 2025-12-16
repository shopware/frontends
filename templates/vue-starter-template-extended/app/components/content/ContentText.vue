<script setup lang="ts">
import { computed } from "vue";
import { getElementProperty } from "~/composables/contentHelpers";
import type { Schemas } from "#shopware";

const props = defineProps<{
  element: Schemas["ContentElement"];
  properties: Record<string, unknown>;
}>();

const title = computed(() =>
  getElementProperty<string>(props.element, "title", ""),
);
const content = computed(() =>
  getElementProperty<string>(props.element, "content", ""),
);
const alignment = computed(() =>
  getElementProperty<"left" | "center" | "right">(
    props.element,
    "alignment",
    "left",
  ),
);
const verticalAlignment = computed(() =>
  getElementProperty<"top" | "center" | "bottom">(
    props.element,
    "verticalAlignment",
    "top",
  ),
);

const alignmentClass = computed(() => {
  const alignMap: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
  return alignMap[alignment.value as string] || "text-left";
});

const verticalAlignClass = computed(() => {
  const alignMap: Record<string, string> = {
    top: "justify-start",
    center: "justify-center",
    bottom: "justify-end",
  };
  return alignMap[verticalAlignment.value as string] || "justify-start";
});
</script>

<template>
  <div
    class="content-text flex flex-col"
    :class="[alignmentClass, verticalAlignClass]"
  >
    <h2
      v-if="title"
      class="text-2xl md:text-3xl font-bold mb-4"
    >
      {{ title }}
    </h2>

    <div
      v-if="content"
      class="prose prose-sm md:prose-base max-w-none"
      v-html="content"
    />

    <!-- Slot for nested content -->
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>
