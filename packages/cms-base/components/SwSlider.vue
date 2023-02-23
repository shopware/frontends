<script setup lang="ts">
import type { SliderElementConfig } from "@shopware-pwa/composables-next";
import { useCmsElementConfig } from "@shopware-pwa/composables-next";
import { CmsSlot } from "@shopware-pwa/types";
import { VNodeArrayChildren } from "vue";

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
  }
);

const { getConfigValue } = useCmsElementConfig({
  config: props.config,
} as CmsSlot & {
  config: SliderElementConfig;
});

const slots = useSlots();
const childrenRaw = computed(
  () => (slots?.default?.()[0].children as VNodeArrayChildren) ?? []
);
const slidesToScroll = computed(() =>
  props.slidesToScroll >= props.slidesToShow
    ? props.slidesToShow
    : props.slidesToScroll
);
const slidesToShow = computed(() =>
  props.slidesToShow >= childrenRaw.value.length
    ? childrenRaw.value.length
    : props.slidesToShow
);
const children = computed(() => {
  if (childrenRaw.value.length === 0) return [];
  return [
    ...childrenRaw.value.slice(-slidesToShow.value),
    ...childrenRaw.value,
    ...childrenRaw.value.slice(0, slidesToShow.value),
  ];
});
const emit = defineEmits<{
  (e: "changeSlide", index: number): void;
}>();
const slider = ref(null);
const imageSlider = ref<HTMLElement>();
const imageSliderTrackStyle = ref<any>({});
const activeSlideIndex = ref<number>(0);
const speed = ref<number>(300);
const imageSliderTrack = ref<HTMLElement>();
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
  () => props.autoplay,
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
  }
);

const imageSliderStyle = computed(() => {
  if (getConfigValue("displayMode") === "cover") {
    return {
      height: getConfigValue("minHeight"),
      margin: `0 -${props.gap}`,
    };
  } else {
    return {
      minHeight: getConfigValue("minHeight"),
    };
  }
});

const verticalAlignValue = computed(
  () => getConfigValue("verticalAlign") || "flex-start"
);
const displayModeValue = computed(
  () => getConfigValue("displayMode") || "standard"
);

const navigationArrowsValue = computed(
  () => props.config?.navigationArrows?.value || "none"
);
const navigationDotsValue = computed(
  () => props.config?.navigationDots?.value || "none"
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
  moving: boolean = false,
  callback = () => {}
) {
  let styleObj: { [K: string]: string } = {
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
      delete styleObj.transition;
      imageSliderTrackStyle.value = { ...styleObj };
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
      height = childComponent?.children[0].children[0].clientHeight
        ? `${childComponent.clientHeight}px`
        : (height = `auto`);
    } else if (displayModeValue.value === "contain") {
      height = `${imageSliderTrack.value?.clientHeight}px`;
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
      'relative overflow-hidden': true,
      'px-10': navigationArrowsValue === 'outside',
      'pb-15': navigationDotsValue === 'outside',
      'opacity-0': !isReady,
    }"
  >
    <div class="overflow-hidden" ref="imageSlider" :style="imageSliderStyle">
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
          <component :is="child" />
        </div>
      </div>
    </div>
    <div :class="{ hidden: navigationArrowsValue === 'none' }">
      <button
        aria-label="Chevron left"
        :class="{
          'absolute top-1/2 left-0 transform -translate-y-1/2 py-4': true,
          'transition bg-white/20 hover:bg-white/50':
            navigationArrowsValue === 'inside',
        }"
        @click="previous"
      >
        <div class="w-15 h-15 i-carbon-chevron-left"></div>
      </button>
      <button
        aria-label="Chevron right"
        :class="{
          'absolute top-1/2 right-0 transform -translate-y-1/2 py-4': true,
          'transition bg-white/20 hover:bg-white/50':
            navigationArrowsValue === 'inside',
        }"
        @click="next"
      >
        <div class="w-15 h-15 i-carbon-chevron-right"></div>
      </button>
    </div>
    <div
      :class="{
        'absolute bottom-5 left-1/2 transform -translate-x-1/2 gap-5': true,
        flex: navigationDotsValue !== 'none',
        hidden: navigationDotsValue === 'none',
      }"
    >
      <div
        v-for="(dot, i) of childrenRaw"
        :key="`dot-${i}`"
        :class="{
          'w-5 h-5 rounded-full cursor-pointer': true,
          'bg-gray-100': i === activeSlideIndex,
          'bg-gray-500/50': i !== activeSlideIndex,
        }"
        @click="() => goToSlide(i)"
      />
    </div>
  </div>
</template>
