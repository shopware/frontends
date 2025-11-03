<script setup lang="ts">
import type { CmsBlockImageThreeCover } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageThreeCover;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
const centerContent = getSlotContent("center");
</script>
<template>
  <div class="cms-block-image-three-cover flex flex-col sm:flex-row justify-start items-start gap-6 w-full">
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
.cms-block-image-three-cover :deep(.cms-element-image) {
  @apply aspect-square object-cover relative h-full w-full;
}

.cms-block-image-three-cover :deep(.cms-element-image img) {
  @apply w-full h-full object-cover;
}
</style>
