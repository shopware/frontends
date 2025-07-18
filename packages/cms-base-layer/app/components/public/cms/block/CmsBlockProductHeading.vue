<script setup lang="ts">
import type { CmsBlockProductHeading } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockProductHeading;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
</script>

<template>
  <div class="cms-block-product-heading flex justify-between">
    <CmsGenericElement :content="leftContent" />
    <CmsGenericElement :content="rightContent" />
  </div>
</template>

<style scoped>
.cms-block-product-heading .cms-element-image {
  @apply max-w-[7.5rem] max-h-[7.5rem];
}
</style>
