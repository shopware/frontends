<script setup lang="ts">
import type { CmsElementImageGallery } from "@shopware/composables";
import { computed, ref } from "vue";
import { useCmsElementConfig } from "#imports";
import { isSpatial } from "../../../../helpers/media/isSpatial";

const props = withDefaults(
  defineProps<{
    content: CmsElementImageGallery;
    slidesToShow?: number;
    slidesToScroll?: number;
  }>(),
  {
    slidesToShow: 5,
    slidesToScroll: 4,
  },
);

const { getConfigValue } = useCmsElementConfig(props.content);

const currentIndex = ref(0);
const mediaGallery = computed(() => props.content.data?.sliderItems ?? []);

function goToSlide(index: number) {
  if (index >= 0 && index < mediaGallery.value.length) {
    currentIndex.value = index;
  }
}

function previous() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function next() {
  if (currentIndex.value < mediaGallery.value.length - 1) {
    currentIndex.value++;
  }
}

const currentImage = computed(() => {
  return mediaGallery.value[currentIndex.value]?.media;
});
</script>

<template>
  <div class="w-full md:w-[44rem] relative inline-flex flex-col justify-center items-center gap-2">
    <!-- Main Image Display -->
    <div data-option="1" class="self-stretch h-[700px] relative overflow-hidden">
      <div v-if="currentImage && isSpatial(currentImage)" class="w-full h-full relative">
        <CmsElementImageGallery3dPlaceholder
          class="w-[712.50px] h-[704.44px] left-[-2.25px] top-[-2.22px] absolute object-cover" />
        <span class="absolute bottom-4 right-4 text-sm bg-gray-800 rounded px-2 py-1 text-white">
          3D
        </span>
      </div>
      <img v-else-if="currentImage"
        class="w-full md:w-[712.50px] h-[704.44px] left-[-2.25px] top-[-2.22px] absolute object-cover"
        :src="currentImage.url" :alt="currentImage.alt || 'Product image'" />
      <img v-else class="w-[712.50px] h-[704.44px] left-[-2.25px] top-[-2.22px] absolute object-cover"
        src="https://placehold.co/712x704" alt="Placeholder image" />
    </div>

    <!-- Navigation Arrows -->
    <div v-if="mediaGallery.length > 1"
      class="w-full md:w-[708px] px-2 left-0 top-[338px] absolute inline-flex justify-between items-center">
      <!-- Previous Button -->
      <button data-state="Default" data-variant="Tertiary"
        class="w-10 h-10 relative bg-brand-tertiary rounded-full hover:bg-brand-tertiary-hover transition-colors disabled:opacity-50"
        :disabled="currentIndex === 0" @click="previous" aria-label="Previous image">
        <div class="w-6 h-6 left-[8px] top-[8px] absolute">
          <div class="w-4 h-4 left-[4px] top-[4px] absolute origin-top-left">
            <div class="i-carbon-chevron-left w-full h-full font-bold"></div>
          </div>
        </div>
      </button>

      <!-- Next Button -->
      <button data-state="Default" data-variant="Tertiary"
        class="w-10 h-10 relative bg-brand-tertiary rounded-full hover:bg-brand-tertiary-hover transition-colors disabled:opacity-50"
        :disabled="currentIndex === mediaGallery.length - 1" @click="next" aria-label="Next image">
        <div class="w-6 h-6 left-[8px] top-[8px] absolute">
          <div class="w-4 h-4 right-[4px] bottom-[-12px] absolute origin-top-left -rotate-90">
            <div class="i-carbon-chevron-down w-full h-full font-bold"></div>
          </div>
        </div>
      </button>
    </div>

    <!-- Dot Indicators -->
    <div v-if="mediaGallery.length > 1" class="inline-flex justify-center items-center gap-2">
      <button v-for="(image, index) in mediaGallery" :key="image.media.url"
        class="relative rounded-full transition-all duration-200 hover:scale-110" :class="{
          'w-6 h-2 bg-surface-on-surface-variant': index === currentIndex,
          'w-2 h-2 bg-surface-surface-container-highest': index !== currentIndex
        }" @click="goToSlide(index)" :aria-label="`Go to image ${index + 1}`" />
    </div>
  </div>
</template>
