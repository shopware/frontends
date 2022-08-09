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
</script>
<template>
  <!-- TODO: using a tag only works with externalLink, need to improve this element to deal with both internalLink & externalLink -->
  <component
    class="cms-element-image relative"
    :is="imageLink.url ? 'a' : 'div'"
    :style="containerStyle"
    v-bind="imageContainerAttrs"
  >
    <img
      :class="{
        'h-full w-full': true,
        'absolute inset-0': ['cover', 'stretch'].includes(displayMode),
        'object-cover': displayMode === 'cover',
      }"
      v-bind="imageAttrs"
    />
  </component>
</template>
