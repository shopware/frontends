<script setup lang="ts">
import type {
  CmsElementImage,
  CmsElementManufacturerLogo,
} from "@shopware/composables";
import { buildUrlPrefix } from "@shopware/helpers";
import { useElementSize } from "@vueuse/core";
import { computed, defineAsyncComponent, useTemplateRef } from "vue";
import { useCmsElementImage, useUrlResolver } from "#imports";
import { isSpatial } from "../../../../helpers/media/isSpatial";

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

const imageElement = useTemplateRef<HTMLImageElement>("imageElement");
const { width, height } = useElementSize(imageElement);

function roundUp(num: number) {
  return Math.ceil(num / 100) * 100;
}

const imageSize = computed(() => {
  const containerSize = Math.max(width.value || 0, height.value || 0);
  if (!containerSize) return undefined;
  return roundUp(containerSize * 2);
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
    class="cms-element-image self-stretch relative"
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
        'w-full h-full': true,
        'absolute inset-0': ['cover', 'stretch'].includes(displayMode),
        'object-cover': displayMode === 'cover',
        'object-contain': displayMode !== 'cover',
      }"
    >
      <source :src="imageAttrs.src" :type="mimeType" />
      Your browser does not support the video tag.
    </video>
    <ClientOnly v-else-if="isSpatial(props.content.data.media)">
      <component :is="SwMedia3D" :src="props.content.data.media.url" />
    </ClientOnly>
    <NuxtImg
      v-else
      ref="imageElement"
      preset="productDetail"
      loading="lazy"
      :width="imageSize"
      :height="imageSize"
      :class="{
        'w-full': !imageGallery,
        'h-full': !imageGallery && ['cover', 'stretch'].includes(displayMode),
        'w-4/5': imageGallery,
        'absolute left-0 top-0': ['cover', 'stretch'].includes(displayMode),
        'object-cover': displayMode === 'cover',
        'object-contain': imageGallery || displayMode !== 'cover',
      }"
      :alt="imageAttrs.alt"
      :src="imageAttrs.src"
    />
  </component>
</template>

<style scoped>
.cms-element-image {
  display: block;
  width: 100%;
  height: 100%;
}

/* Ensure anchor tags within the element fill the container */
.cms-element-image a {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
