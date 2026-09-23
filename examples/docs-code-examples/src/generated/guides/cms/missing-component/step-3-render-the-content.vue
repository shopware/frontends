<!-- components/{{ componentName }}.vue -->
<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: Schemas["CmsBlock"];
}>();

const { getSlotContent } = useCmsBlock(props.content);
const mainContent = getSlotContent("main");
</script>

<template>
  <div>
    <CmsGenericElement :content="mainContent" />
  </div>
</template>
