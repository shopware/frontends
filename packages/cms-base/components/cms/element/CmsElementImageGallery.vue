<script setup lang="ts">
import { CmsElementImageGallery } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsElementImageGallery;
}>();

const { cmsContent } = useCms();
const product = computed(() => cmsContent.value?.product);
</script>

<template>
  <SwProductGallery :product="product" />
</template>
