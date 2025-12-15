<script setup lang="ts">
import type {
  CmsElementImage,
  CmsElementManufacturerLogo,
} from "@shopware/composables";
import { buildUrlPrefix, encodeUrlPath } from "@shopware/helpers";
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

const DEFAULT_THUMBNAIL_SIZE = 10;
const imageElement = useTemplateRef<HTMLImageElement>("imageElement");
const { width, height } = useElementSize(imageElement);

function roundUp(num: number) {
  return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE;
}

const srcPath = computed(() => {
  if (!imageAttrs.value.src) return "";

  try {
    // Encode the URL first to handle special characters
    const encodedUrl = encodeUrlPath(imageAttrs.value.src);
    const url = new URL(encodedUrl);

    // Only add size parameters if dimensions are available (after mount)
    // This prevents hydration mismatch
    const w = roundUp(width.value);
    const h = roundUp(height.value);

    if (w > DEFAULT_THUMBNAIL_SIZE || h > DEFAULT_THUMBNAIL_SIZE) {
      if (width.value > height.value) {
        url.searchParams.set("width", String(w));
      } else {
        url.searchParams.set("height", String(h));
      }
    }

    // Add fit parameter
    url.searchParams.set("fit", "crop,smart");

    return url.toString();
  } catch {
    // Fallback if URL parsing fails
    return imageAttrs.value.src;
  }
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
      :class="{
        'w-full h-full': !imageGallery,
        'w-4/5': imageGallery,
        'absolute left-0 top-0': ['cover', 'stretch'].includes(displayMode),
        'object-cover': displayMode === 'cover',
        'object-contain': imageGallery || displayMode !== 'cover',
      }"
      :alt="imageAttrs.alt"
      :src="srcPath"
      :srcset="imageAttrs.srcset"
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
