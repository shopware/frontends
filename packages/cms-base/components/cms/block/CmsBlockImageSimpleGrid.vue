<script setup lang="ts">
import { CmsBlockImageSimpleGrid } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageSimpleGrid;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftTopContent = getSlotContent("left-top");
const leftBottomContent = getSlotContent("left-bottom");
const rightContent = getSlotContent("right");
</script>

<template>
  <article class="sw-image-simple-grid">
    <CmsGenericElement
      :content="leftTopContent"
      class="sw-image-simple-grid__image sw-image-simple-grid__image--left-top"
    />
    <CmsGenericElement
      :content="leftBottomContent"
      class="sw-image-simple-grid__image sw-image-simple-grid__image--left-bottom"
    />
    <CmsGenericElement
      :content="rightContent"
      class="sw-image-simple-grid__image sw-image-simple-grid__image--right-full"
    />
  </article>
</template>
