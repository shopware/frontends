<script setup lang="ts">
import { getCmsLayoutConfiguration } from "@shopware/helpers";
import { pascalCase } from "scule";
import { computed, resolveComponent } from "vue";

import type { Schemas } from "#shopware";

const { content } = defineProps<{ content: Schemas["CmsPage"] }>();

const resolveSection = (section: Schemas["CmsSection"]) => {
  const component = resolveComponent(`CmsSection${pascalCase(section.type)}`);
  return typeof component === "string" ? null : component;
};

const sections = computed(() =>
  (content.sections ?? []).map((section) => ({
    section,
    resolved: resolveSection(section),
    layout: getCmsLayoutConfiguration(section),
  })),
);
</script>

<template>
  <template v-for="{ section, resolved, layout } in sections" :key="section.id">
    <component
      :is="resolved"
      v-if="resolved"
      :content="section"
      :class="layout.cssClasses"
      :style="{ backgroundColor: layout.layoutStyles?.backgroundColor }"
    />
    <p v-else>No component for section type {{ section.type }}.</p>
  </template>
</template>
