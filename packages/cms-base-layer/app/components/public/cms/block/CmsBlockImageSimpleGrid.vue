<script setup lang="ts">
import type { CmsBlockImageSimpleGrid } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageSimpleGrid;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftTopContent = getSlotContent("left-top");
const leftBottomContent = getSlotContent("left-bottom");
const rightContent = getSlotContent("right");
</script>

<template>
  <div class="grid md:grid-cols-2 gap-10">
    <div class="grid gap-10">
      <CmsGenericElement :content="leftTopContent" />
      <CmsGenericElement :content="leftBottomContent" />
    </div>
    <CmsGenericElement :content="rightContent" />
  </div>
</template>
