<script setup lang="ts">
import { CmsSlot } from "@shopware-pwa/commons";

const props = defineProps<{
  content: CmsSlot;
}>();

const product = computed(() => props.content.data?.product || {});
</script>

<template>
  <SwProductCard :product="product" />
</template>
