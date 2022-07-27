<script setup lang="ts">
import { CmsElementYoutubeVideo } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsElementYoutubeVideo;
}>();

const config = computed(() => ({
  videoID: props.content.config?.videoID?.value,
  relatedVideos: "rel=0&",
  loop: props.content.config?.loop?.value
    ? `loop=1&playlist=${props.content.config?.videoID?.value}&`
    : "",
  showControls: props.content.config?.showControls?.value ? "controls=0&" : "",
  start:
    parseInt(props.content.config?.start?.value) !== 0
      ? `start=${props.content.config?.start?.value}&`
      : "",
  end:
    parseInt(props.content.config?.end?.value) !== 0
      ? `end=${props.content.config?.end?.value}&`
      : "",
  disableKeyboard: "disablekb=1",
}));

const videoUrl = `https://www.youtube-nocookie.com/embed/\
            ${config.value.videoID}?\
            ${config.value.relatedVideos}\
            ${config.value.loop}\
            ${config.value.showControls}\
            ${config.value.start}\
            ${config.value.end}\
            ${config.value.disableKeyboard}`.replace(/ /g, "");
</script>
<template>
  <div class="cms-element-youtube-video">
    <iframe class="w-full inset-0 aspect-video" :src="videoUrl"> </iframe>
  </div>
</template>
