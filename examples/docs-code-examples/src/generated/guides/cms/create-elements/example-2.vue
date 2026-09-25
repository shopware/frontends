<!-- components/cms/CmsElementImage.vue -->

<script setup lang="ts">
import type { CmsElementImage } from "@shopware/composables";

const props = defineProps<{
  content: CmsElementImage;
}>();
</script>

<template>
  <img :src="props.content.data.media.url" />
</template>
