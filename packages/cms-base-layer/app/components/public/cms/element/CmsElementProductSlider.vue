<script setup lang="ts">
import type {
  CmsElementProductSlider,
  SliderElementConfig,
} from "@shopware/composables";
import { useElementSize } from "@vueuse/core";
import { computed, inject, useTemplateRef } from "vue";
import type { CSSProperties, ComputedRef } from "vue";
import { useCmsElementConfig } from "#imports";

const props = defineProps<{
  content: CmsElementProductSlider;
}>();
const { getConfigValue } = useCmsElementConfig(props.content);

const productSlider = useTemplateRef<HTMLDivElement>("productSlider");
const slotCount = inject<number>("cms-block-slot-count", 1);
const elMinWidth = computed(
  () => +getConfigValue("elMinWidth").replace(/\D+/g, "") || 300,
);
const { width } = useElementSize(productSlider);
const slidesToShow = computed(() => {
  // SSR: useElementSize returns 0, fallback to 1200px estimate divided by slot count
  const containerWidth = width.value || 1200 / slotCount;
  return Math.max(1, Math.floor(containerWidth / elMinWidth.value));
});
const products = computed(() => props.content?.data?.products ?? []);
const config: ComputedRef<SliderElementConfig> = computed(() => ({
  minHeight: {
    value: "450px",
    source: "static",
  },
  verticalAlign: {
    source: "static",
    value: getConfigValue("verticalAlign") || "",
  },
  displayMode: {
    value: "contain",
    source: "static",
  },
  navigationDots: {
    value: getConfigValue("navigation") === true ? "outside" : "",
    source: "static",
  },
  navigationArrows: {
    value: getConfigValue("navigation") === true ? "outside" : "",
    source: "static",
  },
}));

// Responsive SSR breakpoints: scale by slotCount since container is ~1/slotCount of viewport
const ssrBreakpoints = computed(() => {
  const max = slidesToShow.value;
  const bp: Record<string, number> = {};
  for (let n = 2; n <= max; n++) {
    bp[`(min-width: ${elMinWidth.value * n * slotCount}px)`] = n;
  }
  return bp;
});

const autoplay = computed(() => getConfigValue("rotate"));
const title = computed(() => getConfigValue("title"));
const border = computed(() => getConfigValue("border"));

const verticalAlignStyle = computed<CSSProperties>(() => ({
  alignContent: getConfigValue("verticalAlign"),
}));
const hasVerticalAlignment = computed(
  () => !!verticalAlignStyle.value.alignContent,
);
</script>
<template>
  <div
    :style="hasVerticalAlignment ? verticalAlignStyle : undefined"
  >
    <div ref="productSlider" class="cms-element-product-slider">
      <h3 v-if="title" class="pl-6 pb-6 text-center md:text-left text-surface-on-surface">
        {{ title }}
      </h3>
      <div :class="{ 'py-5 border border-outline-outline-variant': border }">
        <SwSlider
          :config="config"
          gap="1.25rem"
          :slides-to-show="slidesToShow"
          :slides-to-scroll="1"
          :autoplay="autoplay"
          :ssr-breakpoints="ssrBreakpoints"
        >
          <SwProductCard
            v-for="product of products"
            :key="product.id"
            class="h-full"
            :product="product"
            :layout-type="getConfigValue('boxLayout')"
            :display-mode="getConfigValue('displayMode')"
          />
        </SwSlider>
      </div>
    </div>
  </div>
</template>
