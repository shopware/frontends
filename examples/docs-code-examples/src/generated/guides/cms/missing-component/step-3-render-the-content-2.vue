<!-- components/{{ componentName }}.vue -->
<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: Schemas["CmsSlot"];
}>();

// config values are typed as `unknown` — assert the shape you need
const title = props.content.config?.title?.value as string | undefined;
</script>

<template>
  <div>
    <h2 v-if="title">{{ title }}</h2>
    <!-- render content.data here -->
  </div>
</template>
