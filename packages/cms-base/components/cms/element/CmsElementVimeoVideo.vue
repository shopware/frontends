<script setup lang="ts">
import { CmsElementVimeoVideo } from "@shopware-pwa/composables-next";
import { Ref, ref } from "vue";

const props = defineProps<{
  content: CmsElementVimeoVideo;
}>();

const vimeoConfigMapping: { [key: string]: string } = {
  byLine: "byline",
  color: "color",
  doNotTrack: "dnt",
  loop: "loop",
  mute: "mute",
  title: "title",
  portrait: "portrait",
  controls: "controls",
};

const videoUrl: Ref = ref(
  `https://player.vimeo.com/video/${props.content.config?.videoID?.value}?`
);

const convertAttr = function (value: any, configKey: string) {
  if (configKey == "color")
    return value
      ? `${vimeoConfigMapping[configKey]}=${value}&`.replace("#", "")
      : "";

  return value ? `${vimeoConfigMapping[configKey]}=${value}&` : "";
};

for (const key in props.content.config) {
  if (vimeoConfigMapping.hasOwnProperty(key)) {
    videoUrl.value += convertAttr(props.content.config?.[key]?.value, key);
  }
}
</script>
<template>
  <div class="cms-element-vimeo-video">
    <iframe
      class="w-full inset-0 aspect-video"
      :src="videoUrl.replace(/ /g, '')"
    >
    </iframe>
  </div>
</template>
