<script setup lang="ts">
import { CmsElementProductBox } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsElementProductBox;
}>();

const product = computed(() => props.content.data?.product || {});
</script>

<template>
  <SwProductCard :product="product" />
</template>
