<script setup lang="ts">
import { CmsBlock } from "@shopware-pwa/commons";

const props = defineProps<{
  content: CmsBlock;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const cmsContent = getSlotContent("content");
</script>
<template>
  <CmsGenericElement v-if="cmsContent" :content="cmsContent" />
</template>
