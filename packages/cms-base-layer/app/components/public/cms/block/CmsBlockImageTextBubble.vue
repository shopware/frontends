<script setup lang="ts">
import type { CmsBlockImageTextBubble } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageTextBubble;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftText = getSlotContent("left-text");
const leftImage = getSlotContent("left-image");
const centerText = getSlotContent("center-text");
const centerImage = getSlotContent("center-image");
const rightText = getSlotContent("right-text");
const rightImage = getSlotContent("right-image");
</script>
<template>
  <div class="cms-block-image-text-bubble flex flex-col sm:flex-row justify-start items-start gap-6 w-full">
    <div class="w-full sm:flex-1 flex flex-col justify-center items-start gap-4">
      <div class="self-stretch flex justify-center">
        <CmsGenericElement
          :content="leftImage"
          class="object-center rounded-full w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64"
        />
      </div>
      <CmsGenericElement :content="leftText" class="self-stretch" />
    </div>
    <div class="w-full sm:flex-1 flex flex-col justify-center items-start gap-4">
      <div class="self-stretch flex justify-center">
        <CmsGenericElement
          :content="centerImage"
          class="object-center rounded-full w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64"
        />
      </div>
      <CmsGenericElement :content="centerText" class="self-stretch" />
    </div>
    <div class="w-full sm:flex-1 flex flex-col justify-center items-start gap-4">
      <div class="self-stretch flex justify-center">
        <CmsGenericElement
          :content="rightImage"
          class="object-center rounded-full w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64"
        />
      </div>
      <CmsGenericElement :content="rightText" class="self-stretch" />
    </div>
  </div>
</template>
