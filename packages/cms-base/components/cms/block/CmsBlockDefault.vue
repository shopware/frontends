<script setup lang="ts">
import { CmsBlock } from "@shopware-pwa/types";

const props = defineProps<{
  content: CmsBlock;
}>();
</script>
<template>
  <CmsGenericElement
    v-for="slot in content.slots"
    :key="slot.id"
    :content="slot"
  />
</template>
