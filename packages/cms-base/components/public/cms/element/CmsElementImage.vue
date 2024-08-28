<script setup lang="ts">
import type {
  CmsElementImage,
  CmsElementManufacturerLogo,
} from "@shopware-pwa/composables-next";
import { useCmsElementImage, useUrlResolver } from "#imports";
import { buildUrlPrefix } from "@shopware-pwa/helpers-next";
import { useElementSize } from "@vueuse/core";
import { computed, ref, defineAsyncComponent } from "vue";
import { isSpatial } from "../../../../helpers/media/isSpatial";
import { ClientOnly } from "../../../../helpers/clientOnly";

const props = defineProps<{
  content: CmsElementImage | CmsElementManufacturerLogo;
  imageGallery?: boolean;
}>();

const { getUrlPrefix } = useUrlResolver();
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
const imageComputedContainerAttrs = computed(() => {
  const imageAttrsCopy = Object.assign({}, imageContainerAttrs.value);
  if (imageAttrsCopy?.href) {
    imageAttrsCopy.href = buildUrlPrefix(
      imageAttrsCopy.href,
      getUrlPrefix(),
    ).path;
  }
  return imageAttrsCopy;
});

const SwMedia3D = computed(() => {
  if (isSpatial(props.content.data.media)) {
    return defineAsyncComponent(() => import("../../../SwMedia3D.vue"));
  }
  return "";
});
</script>
<template>
  <!-- TODO: using a tag only works with externalLink, need to improve this element to deal with both internalLink & externalLink -->
  <component
    :is="imageLink.url ? 'a' : 'div'"
    v-if="imageAttrs.src"
    class="cms-element-image relative h-full w-full"
    :class="{
      'flex justify-center items-center': imageGallery,
    }"
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
    <ClientOnly v-else-if="isSpatial(props.content.data.media)">
      <component :is="SwMedia3D" :src="props.content.data.media.url" />
    </ClientOnly>
    <img
      v-else
      ref="imageElement"
      loading="lazy"
      :class="{
        'w-full h-full': !imageGallery,
        'w-4/5': imageGallery,
        'absolute inset-0': ['cover', 'stretch'].includes(displayMode),
        'object-cover': displayMode === 'cover',
        'object-contain': imageGallery,
      }"
      :alt="imageAttrs.alt"
      :src="srcPath"
      :srcset="imageAttrs.srcset"
    />
  </component>
</template>
