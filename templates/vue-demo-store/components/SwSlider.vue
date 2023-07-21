<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css';
import { VNodeArrayChildren } from "vue";
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon
} from '@heroicons/vue/24/outline';

interface ScreenGap {
  screen: number;
  gap: string
}

const props = withDefaults(
  defineProps<{
    itemsToScroll: number;
    itemsToShow: number;
    snapAlign?: string;
    breakpoints?: any;
    gap?: string;
    navigationDots?: string;
    navigationArrows?: string;
    mouseDrag?: boolean;
    touchDrag?: boolean;
    dynamicHeight?: boolean;
    currentSlideIndex?: number;
    fullContentMobile?: boolean;
  }>(),
  {
    snapAlign: 'start',
    breakpoints: {},
    mouseDrag: true,
    touchDrag: true,
    currentSlideIndex: 0
  }
);

const carouselEl = ref<any>(null);
const gap = ref();
const slots = useSlots();
const childrenRaw = computed<any[]>(
  () => (slots?.default?.()[0].children as VNodeArrayChildren) ?? []
);

const breakpointsGap = computed<ScreenGap[] | null>(() => {
  let screensize: ScreenGap[] = [];
  Object.keys(props.breakpoints).forEach(x => {
    if (props.breakpoints[x].gap) {
      screensize.push({ 
        screen: +x,
        gap: props.breakpoints[x].gap 
      });
    }
  })
  return screensize.length ? screensize : null;
});

const settings = computed<any>(() => ({
  itemsToScroll: props.itemsToScroll,
  snapAlign: props.snapAlign,
  itemsToShow: props.itemsToShow,
  breakpoints: props.breakpoints,
  mouseDrag: props.mouseDrag,
  touchDrag: props.touchDrag,
}));

const carouselStyling = ref({});
const slideStyling = ref({});
const navigationStyling = ref({});

const resizeHandler = useDebounceFn((e: any) => {
  const screenwidth = e.target.innerWidth;
  handleGap(screenwidth);
  carouselEl.value?.restartCarousel();
}, 500);

const handleGap = (screenwidth: number) => {
  const screens = breakpointsGap.value?.map(x => x.screen).sort().reverse() || [];
  let screen;
  for (let i = 0; i <= screens.length; i++) {
    if (screenwidth < screens[i]) continue;
    if (screenwidth >= screens[i]) {
      gap.value = breakpointsGap.value?.[i].gap;
      screen = screens[i];
      break;
    }
  }
  if (!screen) {
    gap.value = props.gap;
  }

  // responsive
  if (screenwidth < 768) {
    carouselStyling.value = {
      marginRight: `-${gap.value}`
    }
    slideStyling.value = {
      paddingRight: `${gap.value}`
    }
    navigationStyling.value = {
      paddingRight: `${gap.value}`
    }
  } else {
    carouselStyling.value = {
      marginLeft: `calc(-${gap.value}/2)`, 
      marginRight: `calc(-${gap.value}/2)`
    }
    slideStyling.value = {
      padding: `0 calc(${gap.value}/2)`
    }
    navigationStyling.value = {
      padding: `0 calc(${gap.value} / 2)`,
    }
  }
}

onMounted(() => {
  handleGap(window.innerWidth);
  carouselEl.value?.restartCarousel();
  if (breakpointsGap.value) {
    window.addEventListener('resize', resizeHandler);
  }
});

onUnmounted(() => {
  if (breakpointsGap.value) {
    window.removeEventListener('resize', resizeHandler);
  }
});

const next = () => {
  carouselEl.value.next();
}

const prev = () => {
  carouselEl.value.prev();
}

const currentSlide = ref(0);

const handleEnd = (e: any) => {
  currentSlide.value = e.currentSlideIndex;
}

const showPrev = computed(() => {
  return props.navigationArrows && currentSlide.value > carouselEl.value?.data.minSlide.value;
});

const showNext = computed(() => {
  return props.navigationArrows && currentSlide.value < carouselEl.value?.data.maxSlide.value;
});
</script>
<template>
  <div class="relative">
    <button v-if="showPrev"  class="hidden md:flex z-30 absolute top-1/2 left-0 trasform -translate-x-1/2 bg-gray-100 rounded-full h-10 w-10 justify-center items-center" @click="prev"><ArrowSmallLeftIcon class="h-5 w-5" /></button>
    <carousel @slide-end="handleEnd" :modelValue="currentSlideIndex" ref="carouselEl" v-bind="settings" :style="carouselStyling">
      <slide :class="{
        'carousel__slide__dynamic__height': props.dynamicHeight
      }" v-for="(child, index) of childrenRaw" :key="index" :style="slideStyling">
        <component :is="child" />
      </slide>
      <template #addons>
        <Pagination 
          v-if="props.navigationDots" 
          :class="[
            props.navigationDots === 'outside' && 'carousel__pagination__outside',
            props.navigationDots === 'inside' && 'carousel__pagination__inside',
          ]"
          :style="navigationStyling"
        />
      </template>
    </carousel>
    <button v-if="showNext" class="hidden md:flex z-30 absolute top-1/2 right-0 trasform translate-x-1/2 bg-gray-100 rounded-full h-10 w-10 justify-center items-center" @click="next"><ArrowSmallRightIcon class="h-5 w-5" /></button>
  </div>
</template>
<style>
.carousel__slide--active {
  height: auto !important;
}
.carousel__slide__dynamic__height {
  height: 0;
}
.carousel__slide {
  @apply items-start;
}

/* custom pagination outside */
.carousel__pagination__outside {
  @apply flex mt-4 md:mt-8;
}
.carousel__pagination__outside .carousel__pagination-item {
  @apply flex-1;
}
.carousel__pagination__outside .carousel__pagination-button {
  @apply w-full p-0;
}
.carousel__pagination__outside .carousel__pagination-button::after {
  @apply w-full bg-light-primary;
  height: 2px;
}
.carousel__pagination__outside .carousel__pagination-button--active::after {
  @apply bg-dark-primary;
}

/* custom pagination inside */
.carousel__pagination__inside {
  @apply absolute bottom-2 left-1/2 translate -translate-x-1/2 md:hidden;
}
.carousel__pagination__inside .carousel__pagination-button {
  padding: 2px;
}
.carousel__pagination__inside .carousel__pagination-button::after {
  @apply bg-gray-100 w-4;
  height: 2px;
}
.carousel__pagination__inside .carousel__pagination-button--active::after {
  @apply bg-gray-900;
}

</style>
