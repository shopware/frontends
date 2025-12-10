<script setup lang="ts">
import type { CmsBlockImageFourColumn } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageFourColumn;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
const centerLeftContent = getSlotContent("center-left");
const centerRightContent = getSlotContent("center-right");
</script>
<template>
  <div class="cms-block-image-four-column flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap justify-start items-start gap-6 w-full">
    <div class="w-full sm:w-[calc(50%-12px)] lg:flex-1">
      <CmsGenericElement :content="leftContent" />
    </div>
    <div class="w-full sm:w-[calc(50%-12px)] lg:flex-1">
      <CmsGenericElement :content="centerLeftContent" />
    </div>
    <div class="w-full sm:w-[calc(50%-12px)] lg:flex-1">
      <CmsGenericElement :content="centerRightContent" />
    </div>
    <div class="w-full sm:w-[calc(50%-12px)] lg:flex-1">
      <CmsGenericElement :content="rightContent" />
    </div>
  </div>
</template>

<style scoped>
.cms-block-image-four-column :deep(.cms-element-image) {
  @apply relative h-full w-full;
}

.cms-block-image-four-column :deep(.cms-element-image img) {
  @apply w-full h-full object-cover;
}
</style>
