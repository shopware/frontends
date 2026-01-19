<script setup lang="ts">
import type { CmsElementImageGallery } from "@shopware/composables";
import { computed, defineAsyncComponent, ref } from "vue";
import { useCmsElementConfig, useImagePlaceholder } from "#imports";
import { isSpatial } from "../../../../helpers/media/isSpatial";

// Load SwMedia3D only on client-side to avoid SSR issues with three.js packages
const SwMedia3DAsync = defineAsyncComponent(
  () => import("../../../SwMedia3D.vue"),
);

const props = defineProps<{
  content: CmsElementImageGallery;
}>();

const { getConfigValue } = useCmsElementConfig(props.content);

const minHeight = computed(() => getConfigValue("minHeight") || "500px");
const navigationArrows = computed(
  () => getConfigValue("navigationArrows") || "inside",
);
const navigationDots = computed(
  () => getConfigValue("navigationDots") || "inside",
);

const currentIndex = ref(0);
const mediaGallery = computed(() => props.content.data?.sliderItems ?? []);
const placeholderSvg = useImagePlaceholder();

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

// Touch event handling for mobile swipe gestures
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
</script>

<template>
  <div
    class="w-full max-w-full relative inline-flex flex-col justify-center items-center gap-2 mx-auto"
  >
    <div class="w-full">
      <!-- Main Image Display -->
      <div
        class="w-full relative overflow-hidden"
        :style="{ minHeight }"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <Transition name="gallery-fade" mode="out-in">
          <!-- 3D media -->
          <div
            v-if="currentImage && isSpatial(currentImage)"
            :key="currentImage.url + '-3d'"
            class="w-full h-full relative"
          >
            <client-only>
              <SwMedia3DAsync :src="currentImage.url" />
              <template #fallback>
                <CmsElementImageGallery3dPlaceholder
                  class="w-full h-full absolute inset-0 object-cover"
                />
                <span
                  class="absolute bottom-4 right-4 text-sm bg-gray-800 rounded px-2 py-1 text-white"
                >
                  3D
                </span>
              </template>
            </client-only>
          </div>
          <!-- Regular image -->
          <NuxtImg
            v-else-if="currentImage"
            :key="currentImage.url"
            preset="hero"
            loading="lazy"
            class="w-full h-full absolute inset-0 object-cover"
            :placeholder="placeholderSvg"
            :src="currentImage.url"
            :alt="currentImage.alt || 'Product image'"
          />
          <!-- Placeholder -->
          <img
            v-else
            class="w-full h-full absolute inset-0 object-cover"
            :src="placeholderSvg"
            alt="Placeholder image"
          />
        </Transition>
      </div>

      <!-- Navigation Arrows -->
      <div
        v-if="mediaGallery.length > 1 && navigationArrows !== 'none'"
        class="absolute inset-0 flex items-center justify-between px-2 sm:px-4 pointer-events-none"
      >
        <!-- Previous Button -->
        <button
          :class="[
            'w-10 h-10 rounded-full transition disabled:opacity-50 pointer-events-auto shadow-lg flex items-center justify-center',
            navigationArrows === 'outside'
              ? 'bg-brand-tertiary text-surface-on-surface'
              : 'bg-white/20 hover:bg-white/50',
          ]"
          :disabled="currentIndex === 0"
          aria-label="Previous image"
          @click="previous"
        >
          <SwChevronIcon direction="left" />
        </button>

        <!-- Next Button -->
        <button
          :class="[
            'w-10 h-10 rounded-full transition disabled:opacity-50 pointer-events-auto shadow-lg flex items-center justify-center',
            navigationArrows === 'outside'
              ? 'bg-brand-tertiary text-surface-on-surface'
              : 'bg-surface-surface/20 hover:bg-surface-surface/50',
          ]"
          :disabled="currentIndex === mediaGallery.length - 1"
          aria-label="Next image"
          @click="next"
        >
          <SwChevronIcon direction="right" />
        </button>
      </div>

      <!-- Dot Indicators -->
      <div
        v-if="mediaGallery.length > 1 && navigationDots !== 'none'"
        :class="[
          'flex justify-center items-center gap-2',
          navigationDots === 'outside' ? 'mt-4' : 'absolute bottom-4 left-1/2 transform -translate-x-1/2',
        ]"
      >
        <button
          v-for="(image, index) in mediaGallery"
          :key="image.media?.url"
          class="relative rounded-full transition-all duration-200 hover:scale-110"
          :class="{
            'w-6 h-2 bg-surface-on-surface-variant': index === currentIndex,
            'w-2 h-2 bg-surface-surface-container-highest':
              index !== currentIndex,
          }"
          :aria-label="`Go to image ${index + 1}`"
          @click="goToSlide(index)"
        />
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
