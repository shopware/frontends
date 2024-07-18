<script setup lang="ts">
import type {
  CmsElementProductSlider,
  SliderElementConfig,
} from "@shopware-pwa/composables-next";
import { useCmsElementConfig } from "#imports";
import { ref, computed, onMounted } from "vue";
import type { ComputedRef } from "vue";
import SwProductCard from "../../../SwProductCard.vue";
import SwSlider from "../../../SwSlider.vue";

const props = defineProps<{
  content: CmsElementProductSlider;
}>();
const { getConfigValue } = useCmsElementConfig(props.content);

const productSlider = ref<HTMLElement>();
const slidesToShow = ref<number>();
const products = computed(() => props.content?.data?.products ?? []);
const config: ComputedRef<SliderElementConfig> = computed(() => ({
  minHeight: {
    value: "300px",
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
    value: "",
    source: "static",
  },
  navigationArrows: {
    value: getConfigValue("navigation") ? "outside" : "",
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
    <h3 v-if="title" class="mb-5 text-lg font-bold text-secondary-700">
      {{ title }}
    </h3>
    <div :class="{ 'py-5 border border-secondary-300': border }">
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
