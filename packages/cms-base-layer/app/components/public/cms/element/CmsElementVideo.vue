<script setup lang="ts">
import type { CmsElementVideo } from "@shopware/composables";
import { defu } from "defu";
import { computed, onMounted, ref, useTemplateRef } from "vue";

import { useCmsTranslations } from "#imports";

import { getVideoElementOptions } from "../../../../helpers/cms/getVideoElementOptions";

const props = defineProps<{
  content: CmsElementVideo;
}>();

type Translations = {
  cms: {
    video: {
      playLabel: string;
      pauseLabel: string;
      notSupported: string;
    };
  };
};

let translations: Translations = {
  cms: {
    video: {
      playLabel: "Play video",
      pauseLabel: "Pause video",
      notSupported: "Your browser does not support the HTML5 video tag.",
    },
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const JUSTIFY_CLASSES = {
  "flex-start": "justify-start",
  center: "justify-center",
  "flex-end": "justify-end",
} as const;

const ALIGN_CLASSES = {
  "flex-start": "self-start",
  center: "self-center",
  "flex-end": "self-end",
} as const;

const options = computed(() => getVideoElementOptions(props.content));

const videoElement = useTemplateRef<HTMLVideoElement>("videoElement");
const isPlaying = ref(false);

function syncPlayingState() {
  const video = videoElement.value;
  isPlaying.value = !!video && !video.paused && !video.ended;
}

function togglePlayback() {
  const video = videoElement.value;
  if (!video) return;

  if (video.paused || video.ended) {
    video.play()?.catch(() => {});
    return;
  }

  video.pause();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  togglePlayback();
}

const toggleAttrs = computed(() => {
  if (options.value.controls) return {};

  const label =
    options.value.ariaLabel ||
    (isPlaying.value
      ? translations.cms.video.pauseLabel
      : translations.cms.video.playLabel);

  return {
    role: "button",
    tabindex: 0,
    "aria-label": label,
    title: options.value.title || label,
  };
});

const toggleListeners = computed(() =>
  options.value.controls ? {} : { click: togglePlayback, keydown: onKeydown },
);

// An autoplaying video can start before hydration attaches the listeners
onMounted(syncPlayingState);
</script>
<template>
  <div
    v-if="options.src"
    class="cms-element-video relative h-full"
    :class="[
      `is-${options.displayMode}`,
      options.displayMode !== 'cover' && 'flex',
      options.horizontalAlign && JUSTIFY_CLASSES[options.horizontalAlign],
    ]"
    v-bind="toggleAttrs"
    v-on="toggleListeners"
  >
    <div
      class="cms-element-alignment min-w-0 max-w-full"
      :class="[
        options.verticalAlign && ALIGN_CLASSES[options.verticalAlign],
        options.displayMode !== 'standard' && 'w-full',
        options.displayMode === 'cover' && 'h-full',
      ]"
    >
      <div
        class="cms-video-container relative w-full"
        :class="{ 'h-full': options.displayMode === 'cover' }"
        :style="
          options.minHeight ? { minHeight: options.minHeight } : undefined
        "
      >
        <span
          v-if="!options.controls"
          class="cms-video-play-icon pointer-events-none absolute left-1/2 top-1/2 z-2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-opacity duration-200"
          :class="isPlaying ? 'opacity-0' : 'opacity-100'"
          aria-hidden="true"
        >
          <span class="i-carbon-play-filled-alt h-8 w-8" />
        </span>
        <!-- `playsinline` is not a boolean attribute to Vue, `false` would render it -->
        <video
          ref="videoElement"
          class="cms-video block max-w-full"
          :class="{
            'w-full': options.displayMode !== 'standard',
            'absolute inset-0 h-full object-cover':
              options.displayMode === 'cover',
            'cursor-pointer': !options.controls,
          }"
          :preload="options.preload"
          :poster="options.poster"
          :autoplay="options.autoplay"
          :muted="options.muted"
          :loop="options.loop"
          :playsinline="options.playsInline || undefined"
          :controls="options.controls"
          :aria-label="options.ariaLabel"
          :title="options.title"
          @play="syncPlayingState"
          @pause="syncPlayingState"
          @ended="syncPlayingState"
        >
          <source :src="options.src" :type="options.mimeType" />
          {{ translations.cms.video.notSupported }}
        </video>
      </div>
    </div>
  </div>
</template>
