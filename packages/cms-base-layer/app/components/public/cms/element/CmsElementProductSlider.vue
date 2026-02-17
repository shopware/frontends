<script setup lang="ts">
import type {
  CmsElementProductSlider,
  SliderElementConfig,
} from "@shopware/composables";
import { computed, onMounted, ref, useTemplateRef } from "vue";
import type { CSSProperties, ComputedRef } from "vue";
import { useCmsElementConfig } from "#imports";

const props = defineProps<{
  content: CmsElementProductSlider;
}>();
const { getConfigValue } = useCmsElementConfig(props.content);

const productSlider = useTemplateRef<HTMLDivElement>("productSlider");
const elMinWidth = computed(
  () => +getConfigValue("elMinWidth").replace(/\D+/g, "") || 300,
);
// SSR: estimate from config minWidth assuming ~1200px container; refined on mount
const slidesToShow = ref<number>(
  Math.max(1, Math.ceil(1200 / (elMinWidth.value * 1.2))),
);
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

onMounted(() => {
  setTimeout(() => {
    if (productSlider.value?.clientWidth) {
      slidesToShow.value = Math.max(
        1,
        Math.ceil(productSlider.value.clientWidth / (elMinWidth.value * 1.2)),
      );
    }
  }, 100);
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
