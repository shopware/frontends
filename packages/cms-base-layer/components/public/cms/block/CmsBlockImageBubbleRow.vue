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
  <div class="cms-block-image-bubble-row grid md:grid-cols-3 gap-10">
    <div class="flex items-center justify-center">
      <CmsGenericElement :content="leftContent" class="w-full" />
    </div>
    <div class="flex items-center justify-center">
      <CmsGenericElement :content="centerContent" class="w-full" />
    </div>
    <div class="flex items-center justify-center">
      <CmsGenericElement :content="rightContent" class="w-full" />
    </div>
  </div>
</template>
<style scoped>
.cms-block-image-bubble-row .cms-element-image {
  @apply object-cover max-w-xs overflow-hidden rounded-full aspect-square;
}
</style>
