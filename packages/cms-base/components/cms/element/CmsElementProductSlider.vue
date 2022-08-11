<script setup lang="ts">
import { CmsElementProductSlider } from "@shopware-pwa/composables-next";
import SwProductCard from "../../SwProductCard.vue";

const props = defineProps<{
  content: CmsElementProductSlider;
}>();

const productSlider = ref<HTMLElement>();
const slidesToShow = ref<number>();
const products = computed(() => props.content?.data?.products ?? []);
const config = computed(() => ({
  minHeight: {
    value: "300px",
    source: "static",
  },
  verticalAlign: props.content.config.verticalAlign,
  displayMode: {
    value: "contain",
    source: "static",
  },
  navigationDots: {
    value: "",
    source: "static",
  },
  navigationArrows: {
    value: props.content.config.navigation?.value ? "outside" : "",
    source: "static",
  },
}));

onMounted(() => {
  setTimeout(() => {
    let temp = 1;
    const minWidth = +props.content.config.elMinWidth.value.replace(/\D+/g, "");
    if (productSlider.value?.clientWidth) {
      temp = Math.floor(productSlider.value?.clientWidth / (minWidth * 1.2));
    }
    slidesToShow.value = temp;
  }, 100);
});

const autoplay = computed(() => !!props.content.config.rotate.value);
const title = computed(() => props.content.config.title.value);
const layoutType = computed(() => props.content.config.boxLayout.value);
const displayMode = computed(() => props.content.config.displayMode.value);
const border = computed(() => !!props.content.config.border.value);
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
          :layoutType="layoutType"
          :displayMode="displayMode"
        />
      </SwSlider>
    </div>
  </div>
</template>
