<script setup lang="ts">
import {
  CmsElementImage,
  CmsElementManufacturerLogo,
  useCmsElementImage,
} from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsElementImage | CmsElementManufacturerLogo;
}>();

const {
  containerStyle,
  displayMode,
  imageContainerAttrs,
  imageAttrs,
  imageLink,
} = useCmsElementImage(props.content);

const DEFAULT_THUMBNAIL_SIZE = 10;
const imageElement = ref(null);
const { width, height } = useElementSize(imageElement);

function roundUp(num: number) {
  return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE;
}

const srcPath = computed(() => {
  const biggestParam =
    width.value > height.value
      ? `width=${roundUp(width.value)}`
      : `height=${roundUp(height.value)}`;
  return `${imageAttrs.value.src}?${biggestParam}&fit=crop,smart`;
});
</script>
<template>
  <!-- TODO: using a tag only works with externalLink, need to improve this element to deal with both internalLink & externalLink -->
  <component
    v-if="imageAttrs.src"
    class="cms-element-image relative h-full w-full"
    :is="imageLink.url ? 'a' : 'div'"
    :style="containerStyle"
    v-bind="imageContainerAttrs"
  >
    <img
      ref="imageElement"
      loading="lazy"
      :class="{
        'h-full w-full': true,
        'absolute inset-0': ['cover', 'stretch'].includes(displayMode),
        'object-cover': displayMode === 'cover',
      }"
      alt="Image link"
      :src="srcPath"
    />
  </component>
</template>
