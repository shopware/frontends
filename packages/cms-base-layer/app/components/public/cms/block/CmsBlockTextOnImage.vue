<script setup lang="ts">
import type { CmsBlockTextOnImage } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockTextOnImage;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const slotContent = getSlotContent("content");
</script>

<template>
  <div
    class="cms-block-text-on-image min-h-[500px] py-20 bg-cover bg-bottom bg-no-repeat relative"
  >
    <CmsGenericElement
      v-if="slotContent"
      :content="slotContent"
    />
  </div>
</template>
