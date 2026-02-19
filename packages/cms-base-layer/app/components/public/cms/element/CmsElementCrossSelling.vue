<script setup lang="ts">
import type {
  CmsElementCrossSelling,
  SliderElementConfig,
} from "@shopware/composables";
import { useElementSize } from "@vueuse/core";
import { computed, ref, useTemplateRef } from "vue";
import { useCmsElementConfig } from "#imports";

const props = defineProps<{
  content: CmsElementCrossSelling;
}>();

const { getConfigValue } = useCmsElementConfig(props.content);
const currentTabIndex = ref<number>(0);
const crossSellContainer = useTemplateRef<HTMLDivElement>("crossSellContainer");
const config = computed<SliderElementConfig>(() => ({
  minHeight: {
    value: "300px",
    source: "static",
  },
  minWidth: {
    value: "300px",
    source: "static",
  },
  displayMode: {
    value: "contain",
    source: "static",
  },
  navigationDots: {
    value: "",
    source: "static",
  },
  navigationArrows: {
    value: "outside",
    source: "static",
  },
}));

const crossSellCollections = computed(() => {
  return (
    props.content?.data?.crossSellings?.filter(
      (collection) => !!collection.products.length,
    ) || []
  );
});

const { width } = useElementSize(crossSellContainer);
const elMinWidth = computed(
  () => +(config.value.minWidth?.value.replace(/\D+/g, "") || 300),
);
const slidesToShow = computed(() => {
  // SSR: useElementSize returns 0, fallback to 1200px estimate
  const containerWidth = width.value || 1200;
  return Math.max(1, Math.floor(containerWidth / elMinWidth.value));
});

// Responsive SSR breakpoints: n items require n * minWidth viewport width
const ssrBreakpoints = computed(() => {
  const max = slidesToShow.value;
  const bp: Record<string, number> = {};
  for (let n = 2; n <= max; n++) {
    bp[`(min-width: ${elMinWidth.value * n}px)`] = n;
  }
  return bp;
});

const toggleTab = (index: number) => {
  if (currentTabIndex.value === index) return;
  currentTabIndex.value = index;
};
</script>

<template>
  <div ref="crossSellContainer" class="cms-element-cross-selling">
    <div class="flex gap-10 mb-5">
      <a
        v-for="(collection, index) of crossSellCollections"
        :key="index"
        class="transition text-lg font-semibold text-surface-on-surface-variant cursor-pointer"
        :class="{
          'border-b-3 border-brand-primary text-brand-primary': currentTabIndex === index,
        }"
        @click="toggleTab(index)"
      >
        {{ collection.crossSelling.name }}
      </a>
    </div>
    <transition name="fade" mode="out-in">
      <SwSlider
        v-if="crossSellCollections.length"
        :config="config"
        gap="1.25rem"
        :slides-to-show="slidesToShow"
        :slides-to-scroll="1"
        :autoplay="false"
        :ssr-breakpoints="ssrBreakpoints"
      >
        <SwProductCard
          v-for="product of crossSellCollections[currentTabIndex]?.products"
          :key="product.id"
          class="w-[300px]"
          :product="product"
          :layout-type="getConfigValue('boxLayout')"
          :display-mode="getConfigValue('displayMode')"
        />
      </SwSlider>
    </transition>
  </div>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
