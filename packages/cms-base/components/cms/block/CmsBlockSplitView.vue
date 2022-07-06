<script setup lang="ts">
import { CmsBlock } from "@shopware-pwa/commons";

const props = defineProps<{
  content: CmsBlock;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
</script>

<template>
  <div class="cms-block-split-view">
    <CmsGenericElement
      :content="leftContent"
      class="cms-block-split-view__element"
    />
    <CmsGenericElement
      :content="rightContent"
      class="cms-block-split-view__element right-view"
    />
  </div>
</template>
