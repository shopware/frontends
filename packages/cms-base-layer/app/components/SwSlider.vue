<script setup lang="ts">
import type { SliderElementConfig } from "@shopware/composables";
import { useElementSize, useResizeObserver } from "@vueuse/core";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  useTemplateRef,
  watch,
} from "vue";
import type { CSSProperties, VNodeArrayChildren } from "vue";
import { useCmsElementConfig } from "#imports";
import type { Schemas } from "#shopware";

const props = withDefaults(
  defineProps<{
    config: SliderElementConfig;
    slidesToShow?: number;
    slidesToScroll?: number;
    gap?: string;
    autoplay?: boolean;
    autoplaySpeed?: number;
  }>(),
  {
    slidesToShow: 1,
    slidesToScroll: 1,
    gap: "0px",
    autoplay: false,
    autoplaySpeed: 3000,
  },
);

const { getConfigValue } = useCmsElementConfig({
  config: props.config,
} as Omit<Schemas["CmsSlot"], "config"> & {
  config: SliderElementConfig;
});

const slots = useSlots() as {
  default?: () => { children: VNodeArrayChildren }[];
};
const childrenRaw = computed(
  () => (slots?.default?.()[0]?.children as VNodeArrayChildren) ?? [],
);
const slidesToScroll = computed(() =>
  props.slidesToScroll >= props.slidesToShow
    ? props.slidesToShow
    : props.slidesToScroll,
);
const slidesToShow = computed(() =>
  props.slidesToShow >= childrenRaw.value.length
    ? childrenRaw.value.length
    : props.slidesToShow,
);
const children = computed<string[]>(() => {
  if (childrenRaw.value.length === 0) return [];
  return [
    ...childrenRaw.value.slice(-slidesToShow.value),
    ...childrenRaw.value,
    ...childrenRaw.value.slice(0, slidesToShow.value),
  ] as string[];
});
const emit = defineEmits<(e: "changeSlide", index: number) => void>();
const slider = useTemplateRef<HTMLDivElement>("slider");
const imageSlider = useTemplateRef<HTMLDivElement>("imageSlider");
const imageSliderTrackStyle = ref<CSSProperties>();
const activeSlideIndex = ref<number>(0);
const speed = ref<number>(300);
const imageSliderTrack = useTemplateRef<HTMLDivElement>("imageSliderTrack");
const autoPlayInterval = ref();
const isReady = ref<boolean>();
const isSliding = ref<boolean>();

const { width: imageSliderWidth } = useElementSize(imageSlider);
let timeoutGuard: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
  initSlider();

  useResizeObserver(slider, () => {
    clearTimeout(timeoutGuard);
    timeoutGuard = setTimeout(() => {
      buildImageSliderTrackStyle(activeSlideIndex.value);
    }, 100);
  });
});

onBeforeUnmount(() => {
  clearInterval(autoPlayInterval.value);
});

watch(
  () => props.autoplay && isReady.value,
  (value) => {
    if (value) {
      autoPlayInterval.value = setInterval(() => {
        next();
      }, props.autoplaySpeed);
    } else {
      if (autoPlayInterval.value) {
        clearInterval(autoPlayInterval.value);
      }
    }
  },
  {
    immediate: true,
  },
);

const imageSliderStyle = computed(() => {
  if (getConfigValue("displayMode") === "cover") {
    return {
      height: getConfigValue("minHeight"),
      margin: `0 -${props.gap}`,
    };
  }
  return {
    minHeight: getConfigValue("minHeight"),
  };
});

const verticalAlignValue = computed(
  () => getConfigValue("verticalAlign") || "flex-start",
);
const displayModeValue = computed(
  () => getConfigValue("displayMode") || "standard",
);

const navigationArrowsValue = computed(
  () => getConfigValue("navigationArrows") || "none",
);
const navigationDotsValue = computed(
  () => getConfigValue("navigationDots") || "none",
);

function initSlider() {
  if (imageSlider.value) {
    setTimeout(() => {
      buildImageSliderTrackStyle(activeSlideIndex.value, false, undefined);
      isReady.value = true;
    }, 100);
  }
}

function buildImageSliderTrackStyle(
  transformIndex: number,
  moving = false,
  callback = () => {},
) {
  let styleObj: CSSProperties = {
    transform: `translate3d(-${
      (transformIndex + slidesToShow.value) *
      (imageSliderWidth.value / slidesToShow.value)
    }px, 0px, 0px)`,
    width: `${children.value.length * imageSliderWidth.value}px`,
  };

  if (imageSliderTrackStyle.value?.height) {
    styleObj.height = imageSliderTrackStyle.value?.height;
  }

  if (moving) {
    styleObj = {
      ...styleObj,
      transition: `transform ${speed.value}ms ease 0s`,
    };
    imageSliderTrackStyle.value = { ...styleObj };
    isSliding.value = true;
    setTimeout(() => {
      const { transition: _, ...styleWithoutTransition } = styleObj;
      imageSliderTrackStyle.value = { ...styleWithoutTransition };
      isSliding.value = false;
      callback();
    }, speed.value);
  } else {
    imageSliderTrackStyle.value = { ...styleObj };
  }

  setTimeout(() => {
    let height = "unset";
    if (displayModeValue.value === "cover") {
      height = "100%";
    } else if (displayModeValue.value === "standard") {
      const childComponent =
        imageSliderTrack.value?.children[transformIndex + 1];
      // If image exist
      height = childComponent?.children[0]?.children[0]?.clientHeight
        ? `${childComponent.clientHeight}px`
        : "auto";
    }
    styleObj = {
      ...styleObj,
      height,
    };
    imageSliderTrackStyle.value = { ...styleObj };
  });
}

function next() {
  if (isSliding.value) return;
  activeSlideIndex.value = activeSlideIndex.value + slidesToScroll.value;
  buildImageSliderTrackStyle(activeSlideIndex.value, true, () => {
    if (
      activeSlideIndex.value ===
      children.value.length - slidesToShow.value * 2
    ) {
      activeSlideIndex.value = 0;
      buildImageSliderTrackStyle(activeSlideIndex.value);
    }
    emit("changeSlide", activeSlideIndex.value);
  });
}

function previous() {
  if (isSliding.value) return;
  activeSlideIndex.value = activeSlideIndex.value - slidesToScroll.value;
  buildImageSliderTrackStyle(activeSlideIndex.value, true, () => {
    if (activeSlideIndex.value <= 0 - slidesToShow.value) {
      activeSlideIndex.value = children.value.length - slidesToShow.value * 3;
      buildImageSliderTrackStyle(activeSlideIndex.value);
    }
    emit("changeSlide", activeSlideIndex.value);
  });
}

function goToSlide(index: number) {
  if (isSliding.value) return;
  if (activeSlideIndex.value === index) return;
  activeSlideIndex.value = index;
  buildImageSliderTrackStyle(activeSlideIndex.value, true);
  emit("changeSlide", activeSlideIndex.value);
}

defineExpose({
  next,
  previous,
  goToSlide,
});
</script>
<template>
  <div
    ref="slider"
    :class="{
      'relative overflow-hidden h-full': true,
      'px-10': navigationArrowsValue === 'outside',
      'pb-15': navigationDotsValue === 'outside',
      'opacity-0': !isReady,
    }"
  >
    <div
      ref="imageSlider"
      class="overflow-hidden h-full"
      :style="imageSliderStyle"
    >
      <div
        ref="imageSliderTrack"
        :class="{
          flex: true,
          'items-center':
            displayModeValue === 'contain' && verticalAlignValue === 'center',
          'items-start':
            displayModeValue === 'contain' &&
            verticalAlignValue === 'flex-start',
          'items-end':
            displayModeValue === 'contain' && verticalAlignValue === 'flex-end',
        }"
        :style="imageSliderTrackStyle"
      >
        <div
          v-for="(child, index) of children"
          :key="index"
          :index="index - slidesToShow"
          :style="{
            width: imageSliderWidth
              ? `${imageSliderWidth / slidesToShow}px`
              : 'auto',
            padding: `0 ${gap}`,
            height: displayModeValue === 'standard' ? 'min-content' : '100%',
          }"
        >
          <component :is="child as any" />
        </div>
      </div>
    </div>
    <div :class="{ hidden: navigationArrowsValue === 'none' }">
      <button
        aria-label="Previous slide"
        :class="{
          'absolute top-1/2 left-0 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center': true,
          'bg-brand-tertiary text-surface-on-surface': navigationArrowsValue === 'outside',
          'transition bg-white/20 hover:bg-white/50': navigationArrowsValue === 'inside',
        }"
        @click="previous"
      >
        <div class="w-6 h-6 i-carbon-chevron-left"></div>
      </button>
      <button
        aria-label="Next slide"
        :class="{
          'absolute top-1/2 right-0 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center': true,
          'bg-brand-tertiary text-surface-on-surface': navigationArrowsValue === 'outside',
          'transition bg-white/20 hover:bg-white/50': navigationArrowsValue === 'inside',
        }"
        @click="next"
      >
        <div class="w-6 h-6 i-carbon-chevron-right"></div>
      </button>
    </div>
    <div
      :class="{
        'absolute bottom-5 left-1/2 transform -translate-x-1/2 gap-2 items-center': true,
        flex: navigationDotsValue !== 'none',
        hidden: navigationDotsValue === 'none',
      }"
    >
      <div
        v-for="(_, i) of childrenRaw"
        :key="`dot-${i}`"
        :class="{
          'rounded-full cursor-pointer transition-all duration-300': true,
          'w-6 h-2 bg-surface-on-surface-variant': i === activeSlideIndex,
          'w-2 h-2 bg-surface-surface-container-highest': i !== activeSlideIndex,
        }"
        @click="() => goToSlide(i)"
      ></div>
    </div>
  </div>
</template>
