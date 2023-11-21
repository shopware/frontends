<script setup lang="ts">
import type { CmsElementProductBox } from "@shopware-pwa/composables-next/composables";
import SwProductCard from "../../../SwProductCard.vue";
import { computed } from "vue";

const props = defineProps<{
  content: CmsElementProductBox;
}>();

const product = computed(() => props.content.data?.product || {});
</script>

<template>
  <SwProductCard :product="product" />
</template>
