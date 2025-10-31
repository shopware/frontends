<script setup lang="ts">
import type { CmsBlockImageBubbleRow } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageBubbleRow;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
const centerContent = getSlotContent("center");
</script>
<template>
  <div class="cms-block-image-bubble-row flex flex-col sm:flex-row justify-start items-start gap-6 w-full">
    <div class="w-full sm:flex-1 flex items-center justify-center">
      <CmsGenericElement :content="leftContent" class="w-full" />
    </div>
    <div class="w-full sm:flex-1 flex items-center justify-center">
      <CmsGenericElement :content="centerContent" class="w-full" />
    </div>
    <div class="w-full sm:flex-1 flex items-center justify-center">
      <CmsGenericElement :content="rightContent" class="w-full" />
    </div>
  </div>
</template>
<style scoped>
.cms-block-image-bubble-row :deep(.cms-element-image) {
  @apply object-cover max-w-xs overflow-hidden rounded-full aspect-square;
}
</style>
