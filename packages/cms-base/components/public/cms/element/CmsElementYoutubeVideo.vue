<script setup lang="ts">
import type { CmsElementYoutubeVideo } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsElementYoutubeVideo;
}>();

const { getConfigValue } = useCmsElementConfig(props.content);

const config = computed(() => ({
  videoID: getConfigValue("videoID"),
  relatedVideos: "rel=0&",
  loop: getConfigValue("loop")
    ? `loop=1&playlist=${getConfigValue("videoID")}&`
    : "",
  showControls: getConfigValue("showControls") ? "controls=0&" : "",
  start:
    parseInt(getConfigValue("start")) !== 0
      ? `start=${getConfigValue("start")}&`
      : "",
  end:
    parseInt(getConfigValue("end")) !== 0
      ? `end=${getConfigValue("end")}&`
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
