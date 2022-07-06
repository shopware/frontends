<script setup lang="ts">
import { CmsBlock } from "@shopware-pwa/commons";

const props = defineProps<{
  content: CmsBlock;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
const centerContent = getSlotContent("center");
</script>

<template>
  <article class="grid md:grid-cols-3 gap-4">
    <CmsGenericElement :content="leftContent" class="" />
    <CmsGenericElement :content="centerContent" class="" />
    <CmsGenericElement :content="rightContent" class="" />
  </article>
</template>
