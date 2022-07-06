<script setup lang="ts">
import { CmsSlot } from "@shopware-pwa/commons";

const props = defineProps<{
  content: CmsSlot;
}>();

const { cmsContent } = useCms();
const product = computed(() => cmsContent.value?.product);
</script>

<template>
  <SwProductGallery :product="product" />
</template>
