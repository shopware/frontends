<script setup lang="ts">
import type { CmsElementYoutubeVideo } from "@shopware/composables";
import { computed } from "vue";
import { useCmsElementConfig } from "#imports";

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
  showControls: getConfigValue("showControls") ? "controls=1&" : "controls=0&",
  start:
    Number.parseInt(getConfigValue("start")) !== 0
      ? `start=${getConfigValue("start")}&`
      : "",
  end:
    Number.parseInt(getConfigValue("end")) !== 0
      ? `end=${getConfigValue("end")}&`
      : "",
  disableKeyboard: "disablekb=1",
}));

const YOUTUBE_URL = "https://www.youtube.com/embed/";
const YOUTUBE_NOCOOKIE_URL = "https://www.youtube-nocookie.com/embed/";
const videoDomain = getConfigValue("advancedPrivacyMode")
  ? YOUTUBE_NOCOOKIE_URL
  : YOUTUBE_URL;

const videoUrl = `${videoDomain}\
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
