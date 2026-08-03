<script setup lang="ts">
import type { CmsBlockImageTwoColumn } from "@shopware/composables";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageTwoColumn;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
</script>
<template>
  <div
    class="cms-block-image-two-column flex flex-col md:flex-row justify-start items-start gap-6 w-full"
  >
    <div class="w-full md:flex-1 md:min-w-0">
      <CmsGenericElement :content="leftContent" />
    </div>
    <div class="w-full md:flex-1 md:min-w-0">
      <CmsGenericElement :content="rightContent" />
    </div>
  </div>
</template>

<style scoped>
.cms-block-image-two-column :deep(.cms-element-image) {
  position: relative;
  height: 100%;
  width: 100%;
}

.cms-block-image-two-column :deep(.cms-element-image img) {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.cms-block-image-two-column :deep(.cms-element-image-slider) {
  width: 100%;
}
</style>
