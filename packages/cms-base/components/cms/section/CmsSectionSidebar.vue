<script setup lang="ts">
import { CmsSection } from "@shopware-pwa/commons";

const props = defineProps<{
  content: CmsSection;
}>();
</script>

<template>
  <CmsGenericBlock
    v-for="cmsBlock in props.content.blocks"
    :key="cmsBlock.id"
    :content="cmsBlock"
  />
</template>
