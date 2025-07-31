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
  <div class="cms-block-image-highlight-row grid md:grid-cols-3 gap-10">
    <CmsGenericElement :content="leftContent" />
    <CmsGenericElement :content="centerContent" />
    <CmsGenericElement :content="rightContent" />
  </div>
</template>

<style scoped>
.cms-block-image-highlight-row .cms-element-image {
  @apply border-[12px] border-white;
}
</style>
