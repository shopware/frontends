<script setup lang="ts">
import type { CmsElementProductBox } from "@shopware/composables";
import { computed } from "vue";
import { useCmsElementConfig } from "#imports";

const props = defineProps<{
  content: CmsElementProductBox;
}>();

const { getConfigValue } = useCmsElementConfig(props.content);
const product = computed(() => props.content.data?.product || {});
</script>

<template>
  <SwProductCard
    v-if="product?.id"
    :product="product"
    :layout-type="getConfigValue('boxLayout')"
  />
  <SwProductCardSkeleton v-else />
</template>
