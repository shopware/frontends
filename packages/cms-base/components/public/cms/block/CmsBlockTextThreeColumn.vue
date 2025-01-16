<script setup lang="ts">
import type { CmsBlockTextThreeColumn } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockTextThreeColumn;
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
