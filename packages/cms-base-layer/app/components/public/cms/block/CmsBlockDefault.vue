<script setup lang="ts">
import type { Schemas } from "#shopware";

defineProps<{
  content: Schemas["CmsBlock"];
}>();
</script>
<template>
  <CmsGenericElement
    v-for="slot in content.slots"
    :key="slot.id"
    :content="slot"
  />
</template>
