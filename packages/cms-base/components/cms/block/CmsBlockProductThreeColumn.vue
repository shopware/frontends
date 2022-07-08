<script setup lang="ts">
import { CmsBlockProductThreeColumn } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockProductThreeColumn;
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
