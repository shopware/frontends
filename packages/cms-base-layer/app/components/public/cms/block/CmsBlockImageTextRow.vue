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
  <div class="cms-block-image-text-row flex flex-col sm:flex-row justify-start items-start gap-6 w-full">
    <div class="w-full sm:flex-1 flex flex-col justify-center items-start gap-4">
      <CmsGenericElement :content="leftImageContent" />
      <CmsGenericElement :content="leftTextContent" />
    </div>
    <div class="w-full sm:flex-1 flex flex-col justify-center items-start gap-4">
      <CmsGenericElement :content="centerImageContent" />
      <CmsGenericElement :content="centerTextContent" />
    </div>
    <div class="w-full sm:flex-1 flex flex-col justify-center items-start gap-4">
      <CmsGenericElement :content="rightImageContent" />
      <CmsGenericElement :content="rightTextContent" />
    </div>
  </div>
</template>

<style scoped>
.cms-block-image-text-row :deep(.cms-element-image) {
  @apply relative h-full w-full;
}

.cms-block-image-text-row :deep(.cms-element-image img) {
  @apply w-full h-full object-cover;
}

.cms-block-image-text-row :deep(.cms-element-text) {
  @apply self-stretch min-h-12 inline-flex justify-start items-center;
}
</style>
