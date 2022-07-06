<script setup lang="ts">
import { CmsBlockSidebarFilter } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockSidebarFilter;
}>();

const { getSlotContent } = useCmsBlock(props.content);
const slotContent = getSlotContent("content");
</script>
<template>
  <CmsElementSidebarFilter :content="slotContent" />
</template>
