<script setup lang="ts">
import type { CmsBlockCenterText } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockCenterText;
}>();

const { getSlotContent } = useCmsBlock(props.content);
const slotLeftContent = getSlotContent("left");
const slotRightContent = getSlotContent("right");
const slotCenterContent = getSlotContent("center");
</script>
<template>
  <div class="cms-block-center-text grid md:grid-cols-3 gap-10 content-center">
    <CmsGenericElement :content="slotLeftContent" />
    <CmsGenericElement :content="slotCenterContent" />
    <CmsGenericElement :content="slotRightContent" />
  </div>
</template>

<style scoped>
.cms-block-center-text .cms-element-image {
  @apply aspect-square object-cover;
}
</style>
