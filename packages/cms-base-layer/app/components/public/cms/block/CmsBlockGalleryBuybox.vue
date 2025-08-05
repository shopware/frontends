<script setup lang="ts">
import type { CmsBlockGalleryBuybox } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockGalleryBuybox;
}>();

const { getSlotContent } = useCmsBlock(props.content);
const rightContent = getSlotContent("right");
const leftContent = getSlotContent("left");
</script>

<template>
  <div class="w-full flex flex-col md:flex-row justify-start items-stretch gap-4 md:gap-10 md:px-0">
    <!-- Gallery Section -->
    <div class="w-full md:w-[708px] flex-1 md:flex-initial md:flex-shrink-0">
      <CmsGenericElement :content="leftContent" />
    </div>
    <!-- Buybox Section -->
    <div class="w-full md:w-[572px] flex-1 md:flex-initial md:flex-shrink-0">
      <CmsGenericElement :content="rightContent" />
    </div>
  </div>
</template>
