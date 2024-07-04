<script setup lang="ts">
import type {
  CmsElementCrossSelling,
  SliderElementConfig,
} from "@shopware-pwa/composables-next";
import { useCmsElementConfig } from "#imports";
import SwProductCard from "../../../SwProductCard.vue";
import SwSlider from "../../../SwSlider.vue";
import { ref, computed } from "vue";
import { useElementSize } from "@vueuse/core";

const props = defineProps<{
  content: CmsElementCrossSelling;
}>();

const { getConfigValue } = useCmsElementConfig(props.content);
const currentTabIndex = ref<number>(0);
const crossSellContainer = ref<HTMLElement>();
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
const slidesToShow = computed(() => {
  const minWidth = +(config.value.minWidth?.value.replace(/\D+/g, "") || 0);
  return Math.floor(width.value / (minWidth * 1.2));
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
        class="transition text-lg font-bold text-secondary-700 cursor-pointer"
        :class="{
          'border-b-3 border-primary text-primary': currentTabIndex === index,
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
      >
        <SwProductCard
          v-for="product of crossSellCollections[currentTabIndex].products"
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
