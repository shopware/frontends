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
  <div class="cms-block-image-two-column grid md:grid-cols-2 gap-10">
    <CmsGenericElement :content="leftContent" />
    <CmsGenericElement :content="rightContent" />
  </div>
</template>

<style scoped>
.cms-block-image-two-column .cms-element-image {
  @apply object-cover;
}
</style>
