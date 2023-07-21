<script setup lang="ts">
import type { CmsElementProductSlider } from "@shopware-pwa/composables-next";
import {
  // SliderElementConfig,
  useCmsElementConfig,
} from "@shopware-pwa/composables-next";
// import { ComputedRef } from "vue";
import SwSlider from "../../SwSlider.vue";
import SwProductCard from "../../SwProductCard.vue";

const props = defineProps<{
  content: CmsElementProductSlider;
}>();
const { getConfigValue } = useCmsElementConfig(props.content);

const productSlider = ref<HTMLElement>();
const products = computed(() => props.content?.data?.products ?? []);
// const config: ComputedRef<SliderElementConfig> = computed(() => ({
//   minHeight: {
//     value: "300px",
//     source: "static",
//   },
//   verticalAlign: {
//     source: "static",
//     value: getConfigValue("verticalAlign") || "",
//   },
//   displayMode: {
//     value: "contain",
//     source: "static",
//   },
//   navigationDots: {
//     value: "",
//     source: "static",
//   },
//   navigationArrows: {
//     value: getConfigValue("navigation") ? "outside" : "",
//     source: "static",
//   },
// }));
const autoplay = computed(() => getConfigValue("rotate"));
const title = computed(() => getConfigValue("title"));
const border = computed(() => getConfigValue("border"));

const breakpoints = ref({
  768: {
    itemsToShow: 4,
    itemsToScroll: 2,
    gap: '2rem'
  },
})
</script>
<template>
  <div ref="productSlider" class="cms-element-product-slider">
    <h3 class="mb-8 text-center font-semibold" v-if="title">
      {{ title }}
    </h3>
    <div :class="{ 'py-5 border border-gray-300': border }">
      <SwSlider
        :itemsToScroll="1"
        :itemsToShow="2.5"
        :breakpoints="breakpoints"
        :navigationDots="'outside'"
        :navigationArrows="'inside'"
        gap="1rem"
      >
        <SwProductCard
          v-for="product of products"
          class="w-full h-full"
          :key="product.id"
          :product="product"
          :layoutType="getConfigValue('boxLayout')"
          :displayMode="getConfigValue('displayMode')"
        />
      </SwSlider>
    </div>
  </div>
</template>
