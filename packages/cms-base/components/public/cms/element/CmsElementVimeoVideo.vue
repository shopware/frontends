<script setup lang="ts">
import type { CmsElementVimeoVideo } from "@shopware-pwa/composables-next";
import { ref } from "vue";
import type { Ref } from "vue";
import { useCmsElementConfig } from "#imports";

const props = defineProps<{
  content: CmsElementVimeoVideo;
}>();
const { getConfigValue } = useCmsElementConfig(props.content);
// TODO CMS add proper mapping or config type. This Component needs rework.
type CmsElementVimeoVideoConfigKey = keyof CmsElementVimeoVideo["config"];

const vimeoConfigMapping = {
  byLine: "byline",
  color: "color",
  doNotTrack: "dnt",
  loop: "loop",
  mute: "mute",
  title: "title",
  portrait: "portrait",
  controls: "controls",
  videoID: "videoID",
  autoplay: "autoplay",
  previewMedia: "previewMedia",
  needsConfirmation: "needsConfirmation",
};

const videoUrl: Ref = ref(
  `https://player.vimeo.com/video/${getConfigValue("videoID")}?`,
);

const convertAttr = function (
  value: string,
  configKey: CmsElementVimeoVideoConfigKey,
) {
  if (configKey == "color")
    return value
      ? `${vimeoConfigMapping[configKey]}=${value}&`.replace("#", "")
      : "";

  return value ? `${vimeoConfigMapping[configKey]}=${value}&` : "";
};

for (const key in props.content.config) {
  if (vimeoConfigMapping.hasOwnProperty(key)) {
    videoUrl.value += convertAttr(
      props.content.config[key as CmsElementVimeoVideoConfigKey]
        .value as string,
      key as CmsElementVimeoVideoConfigKey,
    );
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
