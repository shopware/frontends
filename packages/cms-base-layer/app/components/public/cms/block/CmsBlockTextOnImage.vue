<script setup lang="ts">
import type { CmsBlockTextOnImage } from "@shopware/composables";
import { getCmsLayoutConfiguration } from "@shopware/helpers";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockTextOnImage;
}>();

const { getSlotContent } = useCmsBlock(props.content);
const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(props.content);

const slotContent = getSlotContent("content");
</script>

<template>
  <div
    class="cms-block-text-on-image min-h-[500px] flex items-center justify-center py-20 px-4 bg-cover bg-center bg-no-repeat relative"
    :class="cssClasses"
    :style="layoutStyles as any"
  >
    <div class="relative z-10 text-center max-w-6xl">
      <CmsGenericElement
        v-if="slotContent"
        :content="slotContent"
 
      />
    </div>
  </div>
</template>
