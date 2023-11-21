<script setup lang="ts">
import type { CmsBlockCrossSelling } from "@shopware-pwa/composables-next/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockCrossSelling;
}>();
const { getSlotContent } = useCmsBlock(props.content);
const content = getSlotContent("content");
</script>
<template>
  <div class="cms-block-cross-selling">
    <CmsGenericElement :content="content" />
  </div>
</template>
