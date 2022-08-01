<script setup lang="ts">
import { CmsElementImage } from "@shopware-pwa/composables-next";
import { ComputedRef, CSSProperties, ImgHTMLAttributes } from "vue";

const props = defineProps<{
  content: CmsElementImage;
}>();

const containerStyle: ComputedRef<CSSProperties> = computed(() => ({
  minHeight: props.content.config?.minHeight?.value,
}));

const imageLink = computed(() => ({
  newTab: props.content.data?.newTab,
  url: props.content.data?.url,
}));

const imgContainerAttrs = computed(() => {
  const attr: { [k: string]: string } = {};
  if (imageLink.value.url) {
    attr.href = imageLink.value.url;
  }
  if (imageLink.value.newTab) {
    attr.target = "blank";
    attr.rel = "noopener noreferrer";
  }
  return attr;
});

const imgAttrs: ComputedRef<ImgHTMLAttributes> = computed(() => ({
  src: props.content.data?.media?.url,
  alt: props.content.data?.media?.fileName,
  srcset: props.content.data?.media?.thumbnails?.reduce(
    (previousValue, currentValue, currentIndex) =>
      `${previousValue}${currentIndex != 0 ? "," : ""} ${currentValue.url} ${
        currentValue.width
      }w`,
    ""
  ),
}));

const displayMode = computed(() => props.content.config?.displayMode?.value);
</script>
<template>
  <!-- TODO: using a tag only works with externalLink, need to improve this element to deal with both internalLink & externalLink -->
  <component
    class="cms-element-image relative"
    :is="imageLink.url ? 'a' : 'div'"
    :style="containerStyle"
    v-bind="imgContainerAttrs"
  >
    <img
      :class="{
        'h-full w-full': true,
        'absolute inset-0': ['cover', 'stretch'].includes(displayMode),
        'object-cover': displayMode === 'cover',
      }"
      v-bind="imgAttrs"
    />
  </component>
</template>
