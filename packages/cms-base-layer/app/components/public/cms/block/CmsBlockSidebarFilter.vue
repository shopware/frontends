<script setup lang="ts">
import type {
  CmsBlockSidebarFilter,
  CmsElementSidebarFilter,
} from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockSidebarFilter;
}>();

const { getSlotContent } = useCmsBlock(() => props.content);
const slotContent = computed(
  () =>
    getSlotContent("content") as unknown as CmsElementSidebarFilter | undefined,
);
</script>
<template>
  <CmsElementSidebarFilter v-if="slotContent" :content="slotContent" />
</template>
