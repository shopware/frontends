<script setup lang="ts">
import type { CmsBlockTextOnImage } from "@shopware-pwa/composables-next";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockTextOnImage;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const slotContent = getSlotContent("content");
</script>

<template>
  <CmsGenericElement
    v-if="slotContent"
    :content="slotContent"
    class="cms-block-text-on-image min-h-md"
  />
</template>
