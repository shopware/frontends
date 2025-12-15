<script setup lang="ts">
import type { CmsBlockImageTextRow } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageTextRow;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftImageContent = getSlotContent("left-image");
const leftTextContent = getSlotContent("left-text");
const centerImageContent = getSlotContent("center-image");
const centerTextContent = getSlotContent("center-text");
const rightImageContent = getSlotContent("right-image");
const rightTextContent = getSlotContent("right-text");
</script>
<template>
  <div class="cms-block-image-text-row flex flex-col md:flex-row justify-center items-stretch gap-6 w-full">
    <div class="w-full md:flex-1 flex flex-col">
      <div class="flex-1 mb-4 overflow-hidden rounded-lg min-h-64">
        <CmsGenericElement :content="leftImageContent" />
      </div>
      <CmsGenericElement :content="leftTextContent" class="text-center" />
    </div>
    <div class="w-full md:flex-1 flex flex-col">
      <div class="flex-1 mb-4 overflow-hidden rounded-lg min-h-64">
        <CmsGenericElement :content="centerImageContent" />
      </div>
      <CmsGenericElement :content="centerTextContent" class="text-center" />
    </div>
    <div class="w-full md:flex-1 flex flex-col">
      <div class="flex-1 mb-4 overflow-hidden rounded-lg min-h-64">
        <CmsGenericElement :content="rightImageContent" />
      </div>
      <CmsGenericElement :content="rightTextContent" class="text-center" />
    </div>
  </div>
</template>

<style scoped>
.cms-block-image-text-row :deep(.cms-element-image) {
  @apply relative h-full w-full;
}

.cms-block-image-text-row :deep(.cms-element-image img) {
  @apply w-full h-full object-cover rounded-lg;
}

.cms-block-image-text-row :deep(.cms-element-text) {
  @apply self-stretch min-h-12;
}
</style>
