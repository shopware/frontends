<script setup lang="ts">
import { CmsBlockVimeoVideo } from "@shopware-pwa/composables-next";

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
