<script setup lang="ts">
import { CmsElementImageSlider } from "@shopware-pwa/composables-next";
import ChevronLeft from "../../icons/ChevronLeft.vue";
import ChevronRight from "../../icons/ChevronRight.vue";

const props = defineProps<{
  content: CmsElementImageSlider;
}>();
const imageSlider = ref<HTMLElement>(null);
const imageSliderWidth = ref<number>(0);
const imageSliderTrackStyle = ref({});
const activeSlideIndex = ref<number>(0);
const speed = ref<number>(300);
const imageSliderTrack = ref<HTMLElement>();

onMounted(() => {
  initSlider();
});

const imageSliderStyle = computed(() => {
  if (props.content.config.displayMode.value === "cover") {
    return {
      height: props.content.config.minHeight.value,
    };
  } else {
    return {
      minHeight: props.content.config.minHeight.value,
    };
  }
});

const verticalAlignValue = computed(
  () => props.content.config.verticalAlign.value
);
const displayModeValue = computed(() => props.content.config.displayMode.value);

const items = computed(() => props.content.data.sliderItems);
const images = computed(() => {
  if (items.value.length > 1) {
    return [
      items.value[items.value.length - 1],
      ...items.value,
      items.value[0],
    ];
  }
  return items.value;
});
const navigationArrowsValue = computed(
  () => props.content.config.navigationArrows.value || "none"
);
const navigationDotsValue = computed(
  () => props.content.config.navigationDots.value || "none"
);

function initSlider() {
  if (imageSlider.value) {
    setTimeout(() => {
      imageSliderWidth.value = imageSlider.value.clientWidth;
      buildImageSliderTrackStyle(activeSlideIndex.value);
    });
  }
}

function buildImageSliderTrackStyle(
  transformIndex: number,
  moving: boolean = false,
  callback = () => {}
) {
  let styleObj: { [K: string]: string } = {
    transform: `translate3d(-${
      (transformIndex + 1) * imageSliderWidth.value
    }px, 0px, 0px)`,
    width: `${images.value.length * imageSliderWidth.value}px`,
  };

  if (moving) {
    styleObj = {
      ...styleObj,
      transition: `transform ${speed.value}ms ease 0s`,
    };
    imageSliderTrackStyle.value = { ...styleObj };
    setTimeout(() => {
      delete styleObj.transition;
      imageSliderTrackStyle.value = { ...styleObj };
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
      height = `${
        imageSliderTrack.value.children[transformIndex + 1].clientHeight
      }px`;
    }
    styleObj = {
      ...styleObj,
      height,
    };
    imageSliderTrackStyle.value = { ...styleObj };
  });
}

function next() {
  activeSlideIndex.value = activeSlideIndex.value + 1;
  buildImageSliderTrackStyle(activeSlideIndex.value, true, () => {
    if (activeSlideIndex.value === images.value.length - 2) {
      activeSlideIndex.value = 0;
      buildImageSliderTrackStyle(activeSlideIndex.value);
    }
  });
}

function previous() {
  activeSlideIndex.value = activeSlideIndex.value - 1;
  buildImageSliderTrackStyle(activeSlideIndex.value, true, () => {
    if (activeSlideIndex.value === -1) {
      activeSlideIndex.value = images.value.length - 3;
      buildImageSliderTrackStyle(activeSlideIndex.value);
    }
  });
}

function goToSlide(index: number) {
  if (activeSlideIndex.value === index) return;
  activeSlideIndex.value = index;
  buildImageSliderTrackStyle(activeSlideIndex.value, true);
}
</script>
<template>
  <div
    :class="{
      'cms-element-image-slider relative': true,
      'px-10': navigationArrowsValue === 'outside',
      'pb-15': navigationDotsValue === 'outside',
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
        <CmsElementImage
          v-for="image of images"
          class="h-min"
          :key="image.media.id"
          :content="{ data: image, config: props.content.config }"
          :style="{
            width: imageSliderWidth ? `${imageSliderWidth}px` : 'auto',
          }"
        />
      </div>
    </div>
    <div :class="{ hidden: navigationArrowsValue === 'none' }">
      <button
        :class="{
          'absolute top-1/2 left-0 transform -translate-y-1/2 py-4': true,
          'transition bg-white/20 hover:bg-white/50':
            navigationArrowsValue === 'inside',
        }"
        @click="previous"
      >
        <ChevronLeft class="text-3xl" />
      </button>
      <button
        :class="{
          'absolute top-1/2 right-0 transform -translate-y-1/2 py-4': true,
          'transition bg-white/20 hover:bg-white/50':
            navigationArrowsValue === 'inside',
        }"
        @click="next"
      >
        <ChevronRight class="text-3xl" />
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
        v-for="(dot, i) of items"
        :key="dot.media.id"
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
