<script setup lang="ts">
import type { CmsBlockImageThreeColumn } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageThreeColumn;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
const centerContent = getSlotContent("center");
</script>
<template>
  <div class="flex flex-col sm:flex-row justify-start items-start gap-6 w-full">
    <div class="w-full sm:flex-1 flex flex-col justify-center items-start gap-4">
      <CmsGenericElement :content="leftContent" />
    </div>
    <div class="w-full sm:flex-1 flex flex-col justify-center items-start gap-4">
      <CmsGenericElement :content="centerContent" />
    </div>
    <div class="w-full sm:flex-1 flex flex-col justify-center items-start gap-4">
      <CmsGenericElement :content="rightContent" />
    </div>
  </div>
</template>
