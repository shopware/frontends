<script setup lang="ts">
import type {
  CmsElementProductSlider,
  SliderElementConfig,
} from "@shopware-pwa/composables-next/composables";
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
    <h3 class="mb-5 text-lg font-bold text-gray-700" v-if="title">
      {{ title }}
    </h3>
    <div :class="{ 'py-5 border border-gray-300': border }">
      <SwSlider
        :config="config"
        gap="1.25rem"
        :slidesToShow="slidesToShow"
        :slidesToScroll="1"
        :autoplay="autoplay"
      >
        <SwProductCard
          v-for="product of products"
          class="h-full"
          :key="product.id"
          :product="product"
          :layoutType="getConfigValue('boxLayout')"
          :displayMode="getConfigValue('displayMode')"
        />
      </SwSlider>
    </div>
  </div>
</template>
