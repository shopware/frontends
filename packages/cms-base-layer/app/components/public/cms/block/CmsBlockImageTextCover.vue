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
  <article class="flex flex-col md:flex-row justify-start items-start gap-6 w-full">
    <div class="w-full md:flex-1 flex flex-col justify-center items-start gap-4">
      <CmsGenericElement :content="leftContent" />
    </div>
    <div class="w-full md:flex-1 flex flex-col justify-center items-start gap-4">
      <CmsGenericElement :content="rightContent" />
    </div>
  </article>
</template>
