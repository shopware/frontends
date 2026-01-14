<script setup lang="ts">
import type { CmsElementImageGallery } from "@shopware/composables";
import { computed, defineAsyncComponent } from "vue";
import { useImagePlaceholder } from "#imports";
import { isSpatial } from "../../../../helpers/media/isSpatial";

// Load SwMedia3D only on client-side to avoid SSR issues with three.js packages
const SwMedia3DAsync = defineAsyncComponent(
  () => import("../../../SwMedia3D.vue"),
);

const props = defineProps<{
  content: CmsElementImageGallery;
}>();

const mediaGallery = computed(() => props.content.data?.sliderItems ?? []);
const placeholderSvg = useImagePlaceholder();

const sliderConfig = computed(() => ({
  navigationArrows: { source: "static" as const, value: "inside" as const },
  navigationDots: { source: "static" as const, value: "inside" as const },
  ...props.content.config,
}));
</script>

<template>
  <div
    class="w-full max-w-full relative inline-flex flex-col justify-center items-center gap-2 mx-auto"
  >
    <div class="w-full h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden relative">
      <!-- Placeholder shown during SSR and until slider is ready -->
      <img
        class="w-full h-full object-cover absolute inset-0"
        :src="placeholderSvg"
        alt="Gallery placeholder"
      />
      <SwSlider
        v-if="mediaGallery.length > 0"
        class="relative z-1"
        :config="sliderConfig"
      >
        <template v-for="item in mediaGallery" :key="item.media?.url">
          <div class="w-full h-full relative">
            <!-- 3D media -->
            <div
              v-if="item.media && isSpatial(item.media)"
              class="w-full h-full relative"
            >
              <client-only>
                <SwMedia3DAsync :src="item.media.url" />
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
            <!-- regular image -->
            <NuxtImg
              v-else-if="item.media"
              preset="hero"
              loading="lazy"
              class="w-full h-full absolute inset-0 object-cover"
              :placeholder="placeholderSvg"
              :src="item.media.url"
              :alt="item.media.alt || 'Product image'"
            />
          </div>
        </template>
      </SwSlider>
    </div>
  </div>
</template>
