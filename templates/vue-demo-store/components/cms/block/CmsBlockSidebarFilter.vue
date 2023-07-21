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
  <SwProductListingSorting v-if="props.content?.name?.toLowerCase() === 'filter-sort'" :content="slotContent" />
  <CmsElementSidebarFilter v-else :content="slotContent" />
</template>
