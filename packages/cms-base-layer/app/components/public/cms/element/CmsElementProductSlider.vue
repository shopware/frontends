<script setup lang="ts">
import type {
  CmsElementProductSlider,
  SliderElementConfig,
} from "@shopware/composables";
import { computed, onMounted, ref, useTemplateRef } from "vue";
import type { ComputedRef } from "vue";
import { useCmsElementConfig } from "#imports";

const props = defineProps<{
  content: CmsElementProductSlider;
}>();
const { getConfigValue } = useCmsElementConfig(props.content);

const productSlider = useTemplateRef<HTMLDivElement>("productSlider");
const slidesToShow = ref<number>();
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
    let temp = 1;
    const minWidth = +getConfigValue("elMinWidth").replace(/\D+/g, "");
    if (productSlider.value?.clientWidth) {
      temp = Math.ceil(productSlider.value?.clientWidth / (minWidth * 1.2));
    }
    slidesToShow.value = temp;
  }, 100);
});

const autoplay = computed(() => getConfigValue("rotate"));
const title = computed(() => getConfigValue("title"));
const border = computed(() => getConfigValue("border"));
</script>
<template>
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
</template>
