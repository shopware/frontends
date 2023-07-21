<script setup lang="ts">
import { CmsElementImageGallery } from "@shopware-pwa/composables-next";
import SwSlider from "../../SwSlider.vue";
import { getPath } from '~/helpers';

const props = defineProps<{
  content: CmsElementImageGallery;
  slidesToShow?: number;
  slidesToScroll?: number;
}>();

const { getConfigValue } = useCmsElementConfig(props.content);

const currentSlideIndex = ref(0);
const imageThumbsTrack = ref();
const imageThumbsTrackStyle = ref({});
const imageThumbs = ref();
const imageThumbsStyle = ref({});
const mediaGallery = computed(() => props.content.data?.sliderItems ?? []);
const galleryPosition = computed<string>(
  () => getConfigValue("galleryPosition") ?? "left"
);
const navigationArrows = computed(
  () => getConfigValue("navigationArrows") as string ?? ''
);
const navigationDots = computed(
  () => getConfigValue("navigationDots") as string ?? ''
);

function changeCover(i: number) {
  if (i === currentSlideIndex.value) return;
  currentSlideIndex.value = i;
}

const breakpoints = ref({
  768: {
    touchDrag: false,
  },
});
</script>

<template>
  <div
    :class="{
      'flex gap-4': true,
      'flex-col-reverse': galleryPosition === 'underneath',
    }"
  >
    <div
      :class="{
        'hidden md:flex basis-20 relative flex-col items-center':
          galleryPosition === 'left',
        'flex relative w-full': galleryPosition === 'underneath',
      }"
    >
      <div
        class="-my-2"
        ref="imageThumbs"
        :style="imageThumbsStyle"
      >
        <div
          :class="{
            'flex': true,
            'flex-col': galleryPosition === 'left',
          }"
          ref="imageThumbsTrack"
          :style="imageThumbsTrackStyle"
        >
          <div
            v-for="(image, i) in mediaGallery"
            :class="{
              'py-2': galleryPosition === 'left',
              'flex-1 px-2.5': galleryPosition === 'underneath',
            }"
            :key="image.media.url"
          >
            <div
              class="w-20 h-20 cursor-pointer transition duration-150 ease-in-out"
              :class="{
                'ring-2 ring-offset-2 ring-gray-500': i === currentSlideIndex,
                // 'border border-gray-500 border-3': i === currentSlideIndex,
              }"
            >
              <nuxt-img
                :src="getPath(image.media.url)"
                class="w-full h-full object-center object-cover"
                alt="Product image"
                @click="changeCover(i)"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-hidden">
      <SwSlider
        :currentSlideIndex="currentSlideIndex"
        :itemsToScroll="1"
        :itemsToShow="1"
        :navigationDots="navigationDots"
        :navigationArrows="navigationArrows"
        :mouseDrag="false"
        :touchDrag="true"
        :dynamicHeight="true"
        :breakpoints="breakpoints"
      >
        <CmsElementImage
          v-for="image of mediaGallery"
          class="w-full"
          :key="image.media.url"
          :content="{ data: image, config: props.content.config } as any"
        />
      </SwSlider>
    </div>
  </div>
</template>
