<script setup lang="ts">
import type { CmsBlockCrossSelling } from "@shopware-pwa/composables-next";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockCrossSelling;
}>();
const { getSlotContent } = useCmsBlock(props.content);
const slotContent = getSlotContent("content");
</script>
<template>
  <div class="cms-block-cross-selling">
    <CmsGenericElement :content="slotContent" />
  </div>
</template>
