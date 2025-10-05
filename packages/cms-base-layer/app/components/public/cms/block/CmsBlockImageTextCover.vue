<script setup lang="ts">
import type { CmsBlockImageTextCover } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageTextCover;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
</script>
<template>
  <article class="md:grid md:grid-cols-2 gap-10">
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
