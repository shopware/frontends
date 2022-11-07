<script setup lang="ts">
import { CmsBlockProductHeading } from "@shopware-pwa/composables-next";

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
  @apply max-w-30 max-h-30;
}
</style>
