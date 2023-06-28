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
  <div class="grid md:grid-cols-3 gap-10 place-items-center">
    <CmsGenericElement :content="leftContent" class="w-full" />
    <CmsGenericElement :content="centerContent" class="w-full" />
    <CmsGenericElement :content="rightContent" class="w-full" />
  </div>
</template>
