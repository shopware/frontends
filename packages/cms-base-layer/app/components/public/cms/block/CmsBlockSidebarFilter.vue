<script setup lang="ts">
import type {
  CmsBlockSidebarFilter,
  CmsElementSidebarFilter,
} from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockSidebarFilter;
}>();

const { getSlotContent } = useCmsBlock(props.content);
const slotContent = getSlotContent("content") as CmsElementSidebarFilter;
</script>
<template>
  <CmsElementSidebarFilter :content="slotContent" />
</template>
