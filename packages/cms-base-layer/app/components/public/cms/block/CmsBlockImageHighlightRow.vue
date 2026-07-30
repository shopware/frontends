<script setup lang="ts">
import type { CmsBlockImageHighlightRow } from "@shopware/composables";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageHighlightRow;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
const centerContent = getSlotContent("center");
</script>
<template>
  <div
    class="cms-block-image-highlight-row flex flex-col sm:flex-row justify-start items-start gap-6 w-full"
  >
    <div class="w-full sm:flex-1">
      <CmsGenericElement :content="leftContent" />
    </div>
    <div class="w-full sm:flex-1">
      <CmsGenericElement :content="centerContent" />
    </div>
    <div class="w-full sm:flex-1">
      <CmsGenericElement :content="rightContent" />
    </div>
  </div>
</template>

<style scoped>
.cms-block-image-highlight-row :deep(.cms-element-image) {
  position: relative;
  height: 100%;
  width: 100%;
  border: 12px solid #ffffff;
}

.cms-block-image-highlight-row :deep(.cms-element-image img) {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>
