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
  <div class="flex md:flex-row flex-col container mx-auto">
    <CmsElementProductCard :content="leftContent" class="md:pr-4 w-full" />
    <CmsElementProductCard :content="centerContent" class="md:pr-4 w-full" />
    <CmsElementProductCard :content="rightContent" class="w-full" />
  </div>
</template>
