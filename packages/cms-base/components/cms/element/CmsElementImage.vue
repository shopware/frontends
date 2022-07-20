<script setup lang="ts">
import { CmsElementImage } from "@shopware-pwa/composables-next";
import { ComputedRef, CSSProperties } from "vue";

const props = defineProps<{
  content: CmsElementImage;
}>();

const containerStyle: ComputedRef<CSSProperties> = computed(() => ({
  minHeight: props.content.config?.minHeight?.value,
}));

const imageStyle: ComputedRef<CSSProperties> = computed(() => ({
  objectFit: props.content.config?.displayMode?.value,
}));
</script>

<template>
  <div class="relative" :style="containerStyle">
    <img
      class="h-full w-full absolute inset-0"
      :style="imageStyle"
      :src="content.data?.media?.url"
    />
  </div>
</template>
