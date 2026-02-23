<script setup lang="ts">
import type {
  CmsElementImage,
  CmsElementManufacturerLogo,
} from "@shopware/composables";
import {
  buildCdnImageUrl,
  buildUrlPrefix,
  generateCdnSrcSet,
} from "@shopware/helpers";
import { useElementSize } from "@vueuse/core";
import { computed, defineAsyncComponent, inject, useTemplateRef } from "vue";
import { useAppConfig, useCmsElementImage, useUrlResolver } from "#imports";
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

const imageSizes = inject<string>("cms-image-sizes", "100vw");
const appConfig = useAppConfig();

const imageElement = useTemplateRef<HTMLImageElement>("imageElement");
const { width, height } = useElementSize(imageElement);

const cdnOptions = computed(() => ({
  format: appConfig.backgroundImage?.format,
  quality: appConfig.backgroundImage?.quality,
}));

const srcSet = computed(
  () =>
    imageAttrs.value.srcset ||
    generateCdnSrcSet(imageAttrs.value.src, undefined, cdnOptions.value),
);

const srcPath = computed(() => {
  // Only add dimension params after mount to avoid hydration mismatch
  // (useElementSize returns 0 during SSR). The srcset handles responsive loading.
  if (width.value || height.value) {
    return buildCdnImageUrl(
      imageAttrs.value.src,
      { width: width.value, height: height.value },
      cdnOptions.value,
    );
  }
  return imageAttrs.value.src || "";
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
      :sizes="imageSizes"
      :class="{
        'w-full': !imageGallery,
        'h-full': !imageGallery && ['cover', 'stretch'].includes(displayMode),
        'w-4/5': imageGallery,
        'absolute left-0 top-0': ['cover', 'stretch'].includes(displayMode),
        'object-cover': displayMode === 'cover',
        'object-contain': imageGallery || displayMode !== 'cover',
      }"
      :alt="imageAttrs.alt"
      :src="srcPath"
      :srcset="srcSet"
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
