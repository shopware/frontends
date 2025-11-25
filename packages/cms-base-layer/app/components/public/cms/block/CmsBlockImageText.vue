<script setup lang="ts">
import type { CmsBlockImageText } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageText;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
</script>
<template>
  <div class="flex flex-col md:flex-row justify-start items-start gap-6 w-full">
    <div class="w-full md:flex-1">
      <CmsGenericElement :content="leftContent" />
    </div>
    <div class="w-full md:flex-1">
      <CmsGenericElement :content="rightContent" />
    </div>
  </div>
</template>
