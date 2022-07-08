<script setup lang="ts">
import { CmsBlockImageHighlightRow } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageHighlightRow;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
const centerContent = getSlotContent("center");
</script>
<template>
  <article class="grid md:grid-cols-3 gap-10">
    <CmsGenericElement
      :content="leftContent"
      class="cms-block-image-highlight-row__image"
    />
    <CmsGenericElement
      :content="centerContent"
      class="cms-block-image-highlight-row__image"
    />
    <CmsGenericElement
      :content="rightContent"
      class="cms-block-image-highlight-row__image"
    />
  </article>
</template>
