<script setup lang="ts">
import { CmsBlockTextTwoColumn } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockTextTwoColumn;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
</script>

<template>
  <article class="cms-block-text-two-column flex gap-20">
    <CmsGenericElement
      :content="leftContent"
      class="w-1/2 cms-block-text-two-column__text"
    />
    <CmsGenericElement
      :content="rightContent"
      class="w-1/2 cms-block-text-two-column__text"
    />
  </article>
</template>
