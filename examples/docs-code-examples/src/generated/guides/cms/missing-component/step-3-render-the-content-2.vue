<!-- components/{{ componentName }}.vue -->
<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: Schemas["CmsSlot"];
}>();

// config values are typed as `unknown` — assert the shape you need
const config = props.content.config as
  | { title?: { value?: string } }
  | null
  | undefined;
const title = config?.title?.value;
</script>

<template>
  <div>
    <h2 v-if="title">{{ title }}</h2>
    <!-- render content.data here -->
  </div>
</template>
