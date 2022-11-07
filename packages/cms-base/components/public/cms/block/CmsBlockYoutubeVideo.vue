<script setup lang="ts">
import { CmsBlockYoutubeVideo } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockYoutubeVideo;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const slotContent = getSlotContent("video");
</script>
<template>
  <div class="cms-block-youtube-video relative">
    <CmsGenericElement :content="slotContent" />
  </div>
</template>
