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

// Touch event handling for mobile swipe gestures - mobile
const touchStartX = ref(0);
const touchEndX = ref(0);

function onTouchStart(event: TouchEvent) {
  touchStartX.value = event.touches?.[0]?.clientX || 0;
}

function onTouchMove(event: TouchEvent) {
  touchEndX.value = event?.touches?.[0]?.clientX || 0;
}

function onTouchEnd() {
  const deltaX = touchEndX.value - touchStartX.value;

  // Define a threshold for swipe detection
  const threshold = 50; // pixels

  if (Math.abs(deltaX) > threshold) {
    if (deltaX < 0) {
      // Swipe Left
      next();
    } else {
      // Swipe Right
      previous();
    }
  }

  // Reset values
  touchStartX.value = 0;
  touchEndX.value = 0;
}
</script>

<template>
  <div class="w-full max-w-full relative inline-flex flex-col justify-center items-center gap-2 mx-auto">
    <div class="w-full">
      <!-- Main Image Display -->

      <div class="w-full h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[700px] relative overflow-hidden rounded-lg"
        @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
        <Transition name="gallery-fade" mode="out-in">
          <div v-if="currentImage && isSpatial(currentImage)" class="w-full h-full relative">
            <CmsElementImageGallery3dPlaceholder class="w-full h-full absolute inset-0 object-cover" />
            <span class="absolute bottom-4 right-4 text-sm bg-gray-800 rounded px-2 py-1 text-white">
              3D
            </span>
          </div>
          <NuxtImg v-else-if="currentImage" preset="hero" loading="lazy"
            class="w-full h-full absolute inset-0 object-cover" :src="currentImage.url"
            :key="currentImage.url" :alt="currentImage.alt || 'Product image'" />
          <NuxtImg v-else preset="hero" class="w-full h-full absolute inset-0 object-cover"
            src="https://placehold.co/600x500" alt="Placeholder image" />
        </Transition>

      </div>
      <!-- Navigation Arrows -->
      <div v-if="mediaGallery.length > 1"
        class="absolute inset-0 flex items-center justify-between px-2 sm:px-4 pointer-events-none">
        <!-- Previous Button -->
        <button
          class="w-10 h-10 bg-brand-tertiary rounded-full hover:bg-brand-tertiary-hover transition-colors disabled:opacity-50 pointer-events-auto shadow-lg"
          :disabled="currentIndex === 0" @click="previous" aria-label="Previous image">
          <div class="flex items-center justify-center w-full h-full">
            <div class="i-carbon-chevron-left w-5 h-5 text-brand-on-tertiary"></div>
          </div>
        </button>

        <!-- Next Button -->
        <button
          class="w-10 h-10 bg-brand-tertiary rounded-full hover:bg-brand-tertiary-hover transition-colors disabled:opacity-50 pointer-events-auto shadow-lg"
          :disabled="currentIndex === mediaGallery.length - 1" @click="next" aria-label="Next image">
          <div class="flex items-center justify-center w-full h-full">
            <div class="i-carbon-chevron-right w-5 h-5 text-brand-on-tertiary"></div>
          </div>
        </button>
      </div>

      <!-- Dot Indicators -->
      <div v-if="mediaGallery.length > 1" class="flex justify-center items-center gap-2 mt-2">
        <button v-for="(image, index) in mediaGallery" :key="image.media.url"
          class="relative rounded-full transition-all duration-200 hover:scale-110" :class="{
            'w-6 h-2 bg-surface-on-surface-variant': index === currentIndex,
            'w-2 h-2 bg-surface-surface-container-highest': index !== currentIndex
          }" @click="goToSlide(index)" :aria-label="`Go to image ${index + 1}`" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Gallery fade transition */
.gallery-fade-enter-active,
.gallery-fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.gallery-fade-enter-from {
  opacity: 0;
  transform: scale(1.05) translateY(10px);
}

.gallery-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

.gallery-fade-enter-to,
.gallery-fade-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}
</style>
