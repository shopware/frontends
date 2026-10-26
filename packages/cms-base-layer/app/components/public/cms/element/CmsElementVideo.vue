<script setup lang="ts">
import type { CmsElementVideo } from "@shopware/composables";
import { defu } from "defu";
import { computed, onMounted, ref, useId, useTemplateRef } from "vue";

import { useCmsTranslations } from "#imports";

import {
  getVideoAttributes,
  getVideoElementOptions,
  getVideoToggleAttributes,
} from "../../../../helpers/cms/getVideoElementOptions";

const props = defineProps<{
  content: CmsElementVideo;
}>();

type Translations = {
  cms: {
    video: {
      playLabel: string;
      pauseLabel: string;
      loadError: string;
      notSupported: string;
    };
  };
};

let translations: Translations = {
  cms: {
    video: {
      playLabel: "Play video",
      pauseLabel: "Pause video",
      loadError: "The video could not be loaded.",
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
const videoAttributes = computed(() => getVideoAttributes(options.value));

const videoId = useId();
const videoElement = useTemplateRef<HTMLVideoElement>("videoElement");
const isPlaying = ref(false);
const hasFailed = ref(false);

function syncPlayingState() {
  const video = videoElement.value;
  isPlaying.value = !!video && !video.paused && !video.ended;
}

function markFailed() {
  hasFailed.value = true;
  videoElement.value?.pause();
  isPlaying.value = false;
}

function togglePlayback() {
  const video = videoElement.value;
  if (!video || hasFailed.value) return;

  if (video.error || video.networkState === video.NETWORK_NO_SOURCE) {
    markFailed();
    return;
  }

  if (video.paused || video.ended) {
    video.play()?.catch((error: unknown) => {
      if ((error as DOMException | undefined)?.name === "NotSupportedError") {
        markFailed();
      }
    });
    return;
  }

  video.pause();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  if (event.repeat) return;

  togglePlayback();
}

const toggleAttrs = computed(() =>
  getVideoToggleAttributes(
    options.value,
    { isPlaying: isPlaying.value, hasFailed: hasFailed.value, videoId },
    translations.cms.video,
  ),
);

const toggleListeners = computed(() =>
  options.value.controls ? {} : { click: togglePlayback, keydown: onKeydown },
);

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
          v-if="!options.controls && !hasFailed"
          class="cms-video-play-icon pointer-events-none absolute left-1/2 top-1/2 z-2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-opacity duration-200"
          :class="isPlaying ? 'opacity-0' : 'opacity-100'"
          aria-hidden="true"
        >
          <span class="i-carbon-play-filled-alt h-8 w-8" />
        </span>
        <span
          v-if="hasFailed"
          class="cms-video-error pointer-events-none absolute inset-0 z-2 flex items-center justify-center p-4"
        >
          <span
            class="rounded bg-black/60 px-3 py-2 text-center text-sm text-white"
          >
            {{ translations.cms.video.loadError }}
          </span>
        </span>
        <video
          :id="videoId"
          ref="videoElement"
          class="cms-video block max-w-full"
          :class="{
            'w-full': options.displayMode !== 'standard',
            'absolute inset-0 h-full object-cover':
              options.displayMode === 'cover',
            'cursor-pointer': !options.controls && !hasFailed,
          }"
          :style="
            options.placeholderAspectRatio
              ? { aspectRatio: options.placeholderAspectRatio }
              : undefined
          "
          v-bind="videoAttributes"
          @play="syncPlayingState"
          @pause="syncPlayingState"
          @ended="syncPlayingState"
          @error="markFailed"
        >
          <source
            :src="options.src"
            :type="options.mimeType"
            @error="markFailed"
          />
          {{ translations.cms.video.notSupported }}
        </video>
      </div>
    </div>
  </div>
</template>
