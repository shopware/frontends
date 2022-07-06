<script setup lang="ts">
import { CmsBlockImageBubbleRow } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageBubbleRow;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
const centerContent = getSlotContent("center");
</script>
<template>
  <article class="grid grid-cols-3 gap-4 content-center">
    <div class="flex justify-center">
      <CmsGenericElement
        :content="leftContent"
        class="rounded-full"
        style="height: calc(100vw / 3 - 64px); width: calc(100vw / 3 - 64px)"
      />
    </div>
    <div class="flex justify-center">
      <CmsGenericElement
        :content="centerContent"
        class="rounded-full"
        style="height: calc(100vw / 3 - 64px); width: calc(100vw / 3 - 64px)"
      />
    </div>
    <div class="flex justify-center">
      <CmsGenericElement
        :content="rightContent"
        class="rounded-full"
        style="height: calc(100vw / 3 - 64px); width: calc(100vw / 3 - 64px)"
      />
    </div>
  </article>
</template>
