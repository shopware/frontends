<script setup lang="ts">
import { CmsBlockImageTwoColumn } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageTwoColumn;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
</script>
<template>
  <article class="grid md:grid-cols-2 gap-10">
    <CmsGenericElement
      :content="leftContent"
      class="cms-block-image-two-column__image"
    />
    <CmsGenericElement
      :content="rightContent"
      class="cms-block-image-two-column__image"
    />
  </article>
</template>
