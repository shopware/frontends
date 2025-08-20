<script setup lang="ts">
import type { CmsElementProductBox } from "@shopware/composables";

const props = defineProps<{
  content: CmsElementProductBox;
}>();

const product = computed(() => props.content.data?.product || {});
</script>

<template>
  <div v-if="product" class="cms-element-product-box">
    <SwProductAddToCart :product="product" />
  </div>
</template>