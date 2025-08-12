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
  <div class="w-full flex flex-col lg:flex-row justify-center items-stretch gap-4 lg:gap-10 lg:px-0 overflow-hidden">
    <!-- Gallery Section -->
    <div class="w-full lg:w-3/5">
      <CmsGenericElement :content="leftContent" />
    </div>
    <!-- Buybox Section -->
    <div class="w-full lg:w-2/5">
      <CmsGenericElement :content="rightContent" />
    </div>
  </div>
</template>
