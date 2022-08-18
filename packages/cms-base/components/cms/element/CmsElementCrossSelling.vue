<script setup lang="ts">
import {
  CmsElementCrossSelling,
  SliderElementConfig,
} from "@shopware-pwa/composables-next";
import { CmsProductPageResponse } from "@shopware-pwa/types";

const props = defineProps<{
  content: CmsElementCrossSelling;
}>();
const { cmsContent } = useCms();
const currentTabIndex = ref<number>(0);
const crossSellContainer = ref<HTMLElement>();
const slidesToShow = ref<number>();
const isShow = ref<boolean>(true);
const config = computed<SliderElementConfig>(() => ({
  minHeight: {
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
const layoutType = computed(() => props.content.config.boxLayout.value);
const displayMode = computed(() => props.content.config.displayMode.value);
const product = computed(
  () => (cmsContent.value as CmsProductPageResponse)?.product
);
const crossSellCollection = computed(() => {
  if (product.value) {
    return crossSellAssociations.value || [];
  } else {
    return props.content?.data?.crossSellings || [];
  }
});

const {
  loadAssociations: loadCrossSells,
  productAssociations: crossSellAssociations,
} = useProductAssociations({
  product: product,
  associationContext: "cross-selling",
});
onMounted(async () => {
  setTimeout(() => {
    let temp = 1;
    const minWidth = +props.content.config.elMinWidth.value.replace(/\D+/g, "");
    if (crossSellContainer.value?.clientWidth) {
      temp = Math.floor(
        crossSellContainer.value?.clientWidth / (minWidth * 1.2)
      );
    }
    slidesToShow.value = temp;
  }, 100);
  if (!product.value) {
    return;
  }
  loadCrossSells({
    params: {
      associations: {
        seoUrls: {},
      },
    },
  } as any);
});

const toggleTab = (index: number) => {
  if (currentTabIndex.value === index) return;
  currentTabIndex.value = index;
  isShow.value = false;
  setTimeout(() => {
    isShow.value = true;
  });
};
</script>

<template>
  <div ref="crossSellContainer" class="cms-element-cross-selling">
    <div class="flex gap-10 mb-5">
      <a
        v-for="(collection, index) of crossSellCollection"
        :key="index"
        class="transition text-lg font-bold text-gray-700 cursor-pointer"
        :class="{
          'border-b-3 border-brand-primary text-brand-primary':
            currentTabIndex === index,
        }"
        @click="toggleTab(index)"
      >
        {{ collection.crossSelling.name }}
      </a>
    </div>
    <transition name="fade" mode="out-in">
      <SwSlider
        v-if="isShow && crossSellCollection[currentTabIndex].products.length"
        :config="config"
        gap="1.25rem"
        :slidesToShow="slidesToShow"
        :slidesToScroll="1"
        :autoplay="false"
      >
        <SwProductCard
          v-for="product of crossSellCollection[currentTabIndex].products"
          class="h-[600px]"
          :key="product.id"
          :product="product"
          :layoutType="layoutType"
          :displayMode="displayMode"
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
