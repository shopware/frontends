<script setup lang="ts">
import { CmsBlockGalleryBuybox } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockGalleryBuybox;
}>();

const { getSlotContent } = useCmsBlock(props.content);
const rightContent = getSlotContent("right");
const leftContent = getSlotContent("left");
</script>

<template>
  <div
    class="flex flex-col gap-6 md:gap-0 md:flex-row justify-center"
  >
    <div class="-mx-4 md:mx-0 md:w-1/2">
      <CmsGenericElement :content="leftContent" />
    </div>
    <div class="w-full md:w-1/2 md:pl-4">
      <CmsGenericElement :content="rightContent" />
    </div>
  </div>
</template>
