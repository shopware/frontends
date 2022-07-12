<script setup lang="ts">
import { CmsSectionSidebar } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsSectionSidebar;
}>();
</script>

<template>
  <CmsGenericBlock
    v-for="cmsBlock in props.content.blocks"
    :key="cmsBlock.id"
    :content="cmsBlock"
  />
</template>
