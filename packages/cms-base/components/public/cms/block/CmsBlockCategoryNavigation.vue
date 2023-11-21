<script setup lang="ts">
import type { CmsBlockCategoryNavigation } from "@shopware-pwa/composables-next/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockCategoryNavigation;
}>();
const { getSlotContent } = useCmsBlock(props.content);
const slotContent = getSlotContent("content");
</script>

<template>
  <div>
    <CmsGenericElement v-if="slotContent" :content="slotContent" />
  </div>
</template>
