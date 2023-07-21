<script setup lang="ts">
import {
  CmsElementImage,
  CmsElementManufacturerLogo,
  useCmsElementImage,
} from "@shopware-pwa/composables-next";
import { Media } from "@shopware-pwa/types";
import { getPath } from '~/helpers';

const props = withDefaults(
  defineProps<{
    content: CmsElementImage | CmsElementManufacturerLogo;
    loading?: string;
  }>(),
  {
    loading: 'lazy',
  }
);
const $img = useImage()
const {
  containerStyle,
  displayMode,
  imageContainerAttrs,
  imageAttrs,
  imageLink,
}: any = useCmsElementImage(props.content);

const processedImageAttrs = computed(() => {
  const href = imageContainerAttrs.value?.href?.replace('124c71d524604ccbad6042edce3ac799/', '');
  imageContainerAttrs.value.href = href;
  return imageContainerAttrs.value;
})

function getSrcSetForMedia(media: Media): string {
  if (!media?.thumbnails?.length) {
    return "";
  }
  return media.thumbnails
    .map((thumbnail) => {
      return `${$img((getPath(thumbnail.url)))} ${thumbnail.width}w`;
    })
    .join(", ");
}
const srcset = computed(() => {
  const media = props.content?.data?.media;
  return getSrcSetForMedia(media);
})

</script>
<template>
  <!-- TODO: using a tag only works with externalLink, need to improve this element to deal with both internalLink & externalLink -->
  <component
    v-if="imageAttrs.src"
    class="cms-element-image flex relative"
    :is="imageLink.url ? 'a' : 'div'"
    :style="containerStyle"
    v-bind="processedImageAttrs"
  >
    <nuxt-img
      :class="{
        'h-full w-full': true,
        'absolute inset-0': ['cover', 'stretch'].includes(displayMode),
        'object-cover': displayMode === 'cover',
      }"
      :src="getPath(imageAttrs.src)"
      :srcset="props.loading=='preload' ? srcset : null"
      :alt="imageAttrs.alt || 'Image link'"
      :loading="props.loading"
      :preload="props.loading=='preload' ? true : false"
      :imagesizes="props.loading=='preload' ? '100vw' : null"
    />
  </component>
</template>
