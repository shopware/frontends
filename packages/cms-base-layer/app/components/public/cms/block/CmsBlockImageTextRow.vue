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
  <div class="cms-block-image-text-row grid md:grid-cols-3 gap-10">
    <div class="cms-block-image-text-row__column">
      <CmsGenericElement :content="leftImageContent" />
      <CmsGenericElement :content="leftTextContent" />
    </div>
    <div class="cms-block-image-text-row__column">
      <CmsGenericElement :content="centerImageContent" />
      <CmsGenericElement :content="centerTextContent" />
    </div>
    <div class="cms-block-image-text-row__column">
      <CmsGenericElement :content="rightImageContent" />
      <CmsGenericElement :content="rightTextContent" />
    </div>
  </div>
</template>

<style scoped>
.cms-block-image-text-row .cms-element-image {
  @apply object-cover;
}

.cms-block-image-text-row .cms-block-image-text-row__column div:first-child {
  @apply mb-5;
}
</style>
