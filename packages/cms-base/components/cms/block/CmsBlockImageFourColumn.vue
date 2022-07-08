<script setup lang="ts">
import { CmsBlockImageFourColumn } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageFourColumn;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
const centerLeftContent = getSlotContent("center-left");
const centerRightContent = getSlotContent("center-right");
</script>
<template>
  <article class="grid md:grid-cols-4 gap-10">
    <CmsGenericElement
      :content="leftContent"
      class="cms-block-image-four-column__image"
    />
    <CmsGenericElement
      :content="centerLeftContent"
      class="cms-block-image-four-column__image"
    />
    <CmsGenericElement
      :content="centerRightContent"
      class="cms-block-image-four-column__image"
    />
    <CmsGenericElement
      :content="rightContent"
      class="cms-block-image-four-column__image"
    />
  </article>
</template>
