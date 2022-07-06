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
  <article class="cms-block-text-two-column">
    <CmsGenericElement
      :content="leftContent"
      class="cms-block-text-two-column__text"
    />
    <CmsGenericElement
      :content="rightContent"
      class="cms-block-text-two-column__text"
    />
  </article>
</template>
