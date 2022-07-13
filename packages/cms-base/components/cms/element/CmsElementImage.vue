<script setup lang="ts">
import { CmsElementImage } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsElementImage;
}>();
</script>

<template>
  <img class="h-full w-full" :src="content.data?.media?.url" />
</template>
