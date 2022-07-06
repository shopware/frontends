<script setup lang="ts">
import { CmsBlockCenterText } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockCenterText;
}>();

const { getSlotContent } = useCmsBlock(props.content);
const slotLeftContent = getSlotContent("left");
const slotRightContent = getSlotContent("right");
const slotCenterContent = getSlotContent("center");
</script>
<template>
  <article
    class="cms-block-center-text flex flex-col md:flex-row container mx-auto mb-8 mt-8"
  >
    <div class="">
      <CmsGenericElement :content="slotLeftContent" />
    </div>
    <div class="pl-4 pr-4">
      <CmsGenericElement :content="slotCenterContent" />
    </div>
    <div class="">
      <CmsGenericElement :content="slotRightContent" />
    </div>
  </article>
</template>
