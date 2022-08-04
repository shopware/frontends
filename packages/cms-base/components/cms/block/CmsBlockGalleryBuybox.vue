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
  <div class="container mx-auto flex flex-row">
    <div class="mt-6 mb-8 rounded-lg overflow-hidden lg:pr-8 basis-4/6">
      <CmsGenericElement :content="leftContent" />
    </div>
    <div class="mt-6 mb-9 basis-2/6">
      <CmsGenericElement :content="rightContent" />
    </div>
  </div>
</template>
