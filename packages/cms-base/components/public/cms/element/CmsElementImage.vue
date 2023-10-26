<script setup lang="ts">
import { useCmsElementImage } from "@shopware-pwa/composables-next";
import type {
  CmsElementImage,
  CmsElementManufacturerLogo,
} from "@shopware-pwa/composables-next";
import buildUrlPrefix from "../../../../helpers/buildUrlPrefix";
import getUrlPrefix from "../../../../helpers/getUrlPrefix";
const props = defineProps<{
  content: CmsElementImage | CmsElementManufacturerLogo;
}>();

const {
  containerStyle,
  displayMode,
  imageContainerAttrs,
  imageAttrs,
  imageLink,
  isVideoElement,
  mimeType,
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
const urlPrefix = getUrlPrefix();
const imageComputedContainerAttrs = computed(() => {
  const imageAttrsCopy = Object.assign({}, imageContainerAttrs.value);
  if (imageAttrsCopy?.href) {
    imageAttrsCopy.href = buildUrlPrefix(imageAttrsCopy.href, urlPrefix);
  }
  return imageAttrsCopy;
});
</script>
<template>
  <!-- TODO: using a tag only works with externalLink, need to improve this element to deal with both internalLink & externalLink -->
  <component
    v-if="imageAttrs.src"
    class="cms-element-image relative h-full w-full"
    :is="imageLink.url ? 'a' : 'div'"
    :style="containerStyle"
    v-bind="imageComputedContainerAttrs"
  >
    <video
      v-if="isVideoElement"
      controls
      :class="{
        'h-full w-full': true,
        'absolute inset-0': ['cover', 'stretch'].includes(displayMode),
        'object-cover': displayMode === 'cover',
      }"
    >
      <source :src="imageAttrs.src" :type="mimeType" />
      Your browser does not support the video tag.
    </video>
    <img
      v-else
      ref="imageElement"
      loading="lazy"
      :class="{
        'h-full w-full': true,
        'absolute inset-0': ['cover', 'stretch'].includes(displayMode),
        'object-cover': displayMode === 'cover',
      }"
      :alt="imageAttrs.alt"
      :src="srcPath"
      :srcset="imageAttrs.srcset"
    />
  </component>
</template>
