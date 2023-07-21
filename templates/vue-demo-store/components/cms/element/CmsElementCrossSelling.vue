<script setup lang="ts">
import {
  CmsElementCrossSelling,
} from "@shopware-pwa/composables-next";
import { useCmsElementConfig } from "@shopware-pwa/composables-next";
import SwProductCard from "../../SwProductCard.vue";
import SwSlider from "../../SwSlider.vue";

const props = defineProps<{
  content: CmsElementCrossSelling;
}>();

const { getConfigValue } = useCmsElementConfig(props.content);
// const currentTabIndex = ref<number>(0);
const crossSellContainer = ref<HTMLElement>();
// const config = computed<SliderElementConfig>(() => ({
//   minHeight: {
//     value: "300px",
//     source: "static",
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
//     value: "outside",
//     source: "static",
//   },
// }));

const crossSellCollections = computed(() => {
  return (
    props.content?.data?.crossSellings?.filter(
      (collection) => !!collection?.products?.length
    ) || []
  );
});
// const { width } = useElementSize(crossSellContainer);
// const slidesToShow = computed(() => {
//   const minWidth = +getConfigValue("elMinWidth").replace(/\D+/g, "");
//   return Math.floor(width.value / (minWidth * 1.2));
// });

// const toggleTab = (index: number) => {
//   if (currentTabIndex.value === index) return;
//   currentTabIndex.value = index;
// };

const breakpoints = ref({
  768: {
    itemsToShow: 4,
    itemsToScroll: 2,
    gap: '2rem'
  },
});
</script>

<template>
  <div ref="crossSellContainer" class="cms-element-cross-selling">
    <div class="py-10 md:py-20" v-for="collection of crossSellCollections">
      <h3 class="mb-6 md:mb-8 text-center font-semibold" v-if="collection.crossSelling.name">
        {{ collection.crossSelling.name }}
      </h3>
      <div>
        <SwSlider
          :itemsToScroll="1"
          :itemsToShow="2.5"
          :breakpoints="breakpoints"
          :navigationDots="'outside'"
          :navigationArrows="'inside'"
          :fullContentMobile="true"
          gap="1rem"
        >
          <SwProductCard
            v-for="product of collection.products"
            class="w-full h-full"
            :key="product.id"
            :product="product"
            :layoutType="getConfigValue('boxLayout')"
            :displayMode="getConfigValue('displayMode')"
          />
        </SwSlider>
      </div>
    </div>
  </div>
</template>
