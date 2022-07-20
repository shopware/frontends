<script setup lang="ts">
import { CmsBlockImageThreeColumn } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageThreeColumn;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
const centerContent = getSlotContent("center");
</script>
<template>
  <article class="grid md:grid-cols-3 gap-10">
    <CmsGenericElement :content="leftContent" class="aspect-square" />
    <CmsGenericElement :content="centerContent" class="aspect-square" />
    <CmsGenericElement :content="rightContent" class="aspect-square" />
  </article>
</template>
