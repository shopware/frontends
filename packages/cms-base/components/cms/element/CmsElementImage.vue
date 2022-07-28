<script setup lang="ts">
import { CmsElementImage } from "@shopware-pwa/composables-next";
import {
  ComputedRef,
  CSSProperties,
  AnchorHTMLAttributes,
  ImgHTMLAttributes,
} from "vue";

const props = defineProps<{
  content: CmsElementImage;
}>();

const containerStyle: ComputedRef<CSSProperties> = computed(() => ({
  minHeight: props.content.config?.minHeight?.value,
}));

const anchorAttrs: ComputedRef<AnchorHTMLAttributes> = computed(() => ({
  href: props.content.config?.url?.value,
  target: props.content.config?.newTab?.value ? "_blank" : "_self",
}));

const imageStyle: ComputedRef<CSSProperties> = computed(() => ({
  objectFit: props.content.config?.displayMode?.value,
}));

const srcset = "";
const imgAttrs: ComputedRef<ImgHTMLAttributes> = computed(() => ({
  src: props.content.data?.media?.url,
  alt: props.content.data?.media?.fileName,
  srcset: props.content.data?.media?.thumbnails?.reduce(
    (previousValue, currentValue, currentIndex) =>
      `${previousValue}${currentIndex != 0 ? "," : ""} ${currentValue.url} ${
        currentValue.width
      }w`,
    srcset
  ),
}));

const displayMode = computed(() => props.content.config?.displayMode?.value);
</script>
<template>
  <div class="cms-element-image relative" :style="containerStyle">
    <a v-bind="anchorAttrs">
      <img
        :class="['h-full w-full', `is-${displayMode}`]"
        :style="imageStyle"
        v-bind="imgAttrs"
      />
    </a>
  </div>
</template>
<style scoped>
.is-cover {
  @apply object-cover absolute inset-0;
}
.is-stretch {
  @apply absolute inset-0;
}
</style>
