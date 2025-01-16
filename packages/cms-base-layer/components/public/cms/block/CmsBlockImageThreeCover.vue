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
  <div class="cms-block-image-three-cover grid md:grid-cols-3 gap-10">
    <CmsGenericElement :content="leftContent" />
    <CmsGenericElement :content="centerContent" />
    <CmsGenericElement :content="rightContent" />
  </div>
</template>

<style scoped>
.cms-block-image-three-cover .cms-element-image {
  @apply aspect-square object-cover;
}
</style>
