<script setup lang="ts">
import type { CmsBlockVimeoVideo } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockVimeoVideo;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const slotContent = getSlotContent("video");
</script>
<template>
  <div class="cms-block-vimeo-video relative">
    <CmsGenericElement :content="slotContent" />
  </div>
</template>
