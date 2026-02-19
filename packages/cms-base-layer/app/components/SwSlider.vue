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
import type { CSSProperties, VNode, VNodeArrayChildren } from "vue";
import { useCmsElementConfig, useHead, useId } from "#imports";
import type { Schemas } from "#shopware";

const {
  config,
  slidesToShow: slidesToShowProp = 1,
  slidesToScroll: slidesToScrollProp = 1,
  gap = "0px",
  autoplay = false,
  autoplaySpeed = 3000,
  ssrBreakpoints,
} = defineProps<{
  config: SliderElementConfig;
  slidesToShow?: number;
  slidesToScroll?: number;
  gap?: string;
  autoplay?: boolean;
  autoplaySpeed?: number;
  /** CSS media query breakpoints for responsive SSR layout.
   *  Keys are media queries, values are number of visible slides.
   *  e.g. { '(min-width: 768px)': 2, '(min-width: 1280px)': 4 }
   *  Base case (mobile) defaults to 1 visible slide. */
  ssrBreakpoints?: Record<string, number>;
}>();

const sliderId = useId();

const { getConfigValue } = useCmsElementConfig({
  config: config,
} as Omit<Schemas["CmsSlot"], "config"> & {
  config: SliderElementConfig;
});

const slots = useSlots() as {
  default?: () => { children: VNodeArrayChildren }[];
};

// get fresh children from slot - call this each time to get new VNode instances
function getSlotChildren(): VNode[] {
  return (slots?.default?.()[0]?.children as VNode[]) ?? [];
}

const childrenRaw = computed(() => getSlotChildren());

const slidesToScroll = computed(() =>
  slidesToScrollProp >= slidesToShowProp
    ? slidesToShowProp
    : slidesToScrollProp,
);
const slidesToShow = computed(() =>
  slidesToShowProp >= childrenRaw.value.length
    ? childrenRaw.value.length
    : slidesToShowProp,
);

// build children array with fresh VNodes for infinite scroll
// we must call getSlotChildren() separately for each section because Vue can only render each VNode once
const children = computed<VNode[]>(() => {
  const count = childrenRaw.value.length;
  if (count === 0) return [];

  const n = slidesToShow.value;
  return [
    ...getSlotChildren().slice(-n), // prepend: last N slides
    ...getSlotChildren(), // main slides
    ...getSlotChildren().slice(0, n), // append: first N slides
  ];
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

// SSR-safe fallback so the first slide is visible before JS hydrates
const ssrTrackStyle = computed<CSSProperties>(() => {
  const total = children.value.length;
  const n = slidesToShow.value;
  if (total === 0 || n === 0) return {};

  // Transform is constant: always skip N prepended clones
  const transform = `translateX(-${(n / total) * 100}%)`;

  if (ssrBreakpoints) {
    // Track width handled by CSS media queries via useHead
    return { transform };
  }

  return {
    width: `${(total / n) * 100}%`,
    transform,
  };
});

// Inject responsive CSS into <head> — only track width varies per breakpoint
useHead({
  style: [
    {
      innerHTML: computed(() => {
        if (!ssrBreakpoints || imageSliderTrackStyle.value) return "";
        const total = children.value.length;
        if (total === 0) return "";

        const sel = `[data-ssr-slider="${sliderId}"]`;
        // Base (mobile): 1 slide visible
        let css = `${sel}{width:${total * 100}%}`;
        // Breakpoints for larger viewports
        for (const [query, slides] of Object.entries(ssrBreakpoints)) {
          css += `@media ${query}{${sel}{width:${(total / slides) * 100}%}}`;
        }
        return css;
      }),
    },
  ],
});

// Touch event handling for mobile swipe gestures
const touchStartX = ref(0);
const touchEndX = ref(0);

function onTouchStart(event: TouchEvent) {
  touchStartX.value = event.touches?.[0]?.clientX || 0;
}

function onTouchMove(event: TouchEvent) {
  touchEndX.value = event.touches?.[0]?.clientX || 0;
}

function onTouchEnd() {
  const deltaX = touchEndX.value - touchStartX.value;
  const threshold = 50; // pixels

  if (Math.abs(deltaX) > threshold) {
    if (deltaX < 0) {
      next();
    } else {
      previous();
    }
  }

  touchStartX.value = 0;
  touchEndX.value = 0;
}

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
  () => autoplay && isReady.value,
  (value) => {
    if (value) {
      autoPlayInterval.value = setInterval(() => {
        next();
      }, autoplaySpeed);
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
      minHeight: getConfigValue("minHeight"),
      margin: `0 -${gap}`,
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
    }"
  >
    <div
      ref="imageSlider"
      class="overflow-hidden h-full"
      :style="imageSliderStyle"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div
        ref="imageSliderTrack"
        :data-ssr-slider="ssrBreakpoints ? sliderId : undefined"
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
        :style="imageSliderTrackStyle || ssrTrackStyle"
      >
        <div
          v-for="(child, index) of children"
          :key="index"
          :index="index - slidesToShow"
          :style="{
            width: imageSliderWidth
              ? `${imageSliderWidth / slidesToShow}px`
              : `${100 / children.length}%`,
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
          'absolute top-1/2 left-4 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center': true,
          'bg-brand-tertiary text-surface-on-surface':
            navigationArrowsValue === 'outside',
          'transition bg-white/20 hover:bg-white/50':
            navigationArrowsValue === 'inside',
        }"
        @click="previous"
      >
        <SwChevronIcon direction="left" />
      </button>
      <button
        aria-label="Next slide"
        :class="{
          'absolute top-1/2 right-4 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center': true,
          'bg-brand-tertiary text-surface-on-surface':
            navigationArrowsValue === 'outside',
          'transition bg-white/20 hover:bg-white/50':
            navigationArrowsValue === 'inside',
        }"
        @click="next"
      >
        <SwChevronIcon direction="right" />
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
          'w-2 h-2 bg-surface-surface-container-highest':
            i !== activeSlideIndex,
        }"
        @click="() => goToSlide(i)"
      ></div>
    </div>
  </div>
</template>
