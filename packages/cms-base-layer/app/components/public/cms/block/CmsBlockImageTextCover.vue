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
  <article class="flex flex-col md:flex-row justify-start items-start gap-6 w-full pb-6">
    <div class="w-full md:flex-1 px-6 pt-6 md:px-0 md:pt-6 md:pl-6">
      <CmsGenericElement :content="leftContent" />
    </div>
    <div class="w-full md:flex-1 px-6 pt-0 md:pt-6 pb-6 md:px-0 md:pr-6">
      <CmsGenericElement :content="rightContent" />
    </div>
  </article>
</template>
