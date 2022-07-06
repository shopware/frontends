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
  <article class="cms-block-image-text-cover">
    <CmsGenericElement
      :content="leftContent"
      class="cms-block-image-text-cover__image"
    />
    <CmsGenericElement
      :content="rightContent"
      class="cms-block-image-text-cover__text"
    />
  </article>
</template>
