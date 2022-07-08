<script setup lang="ts">
import { CmsBlockProductHeading } from "@shopware-pwa/composables-next";
import { getTranslatedProperty } from "@shopware-pwa/helpers";

const props = defineProps<{
  content: CmsBlockProductHeading;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");

const { cmsContent } = useCms();
const product = computed(() => cmsContent.value?.product);

const productName = computed(
  () =>
    leftContent.data?.content || getTranslatedProperty(product.value, "name")
);
const manufacturerName = computed(
  () =>
    rightContent.data?.content ||
    getTranslatedProperty(product.value?.manufacturer, "name")
);
</script>

<template>
  <div class="container mx-auto pt-8 flex flex-row">
    <h1
      class="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl basis-4/6"
      v-html="productName"
    ></h1>
    <div class="basis-2/6 text-right">{{ manufacturerName }}</div>
  </div>
</template>
