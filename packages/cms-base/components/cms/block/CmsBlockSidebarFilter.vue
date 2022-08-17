<script setup lang="ts">
import type {
  CmsBlockSidebarFilter,
  CmsElementSidebarFilter,
} from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockSidebarFilter;
}>();

const { getSlotContent } = useCmsBlock(props.content);
const slotContent = getSlotContent("content") as CmsElementSidebarFilter;
</script>
<template>
  <CmsElementSidebarFilter :content="slotContent" />
</template>
