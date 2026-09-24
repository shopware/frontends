<!-- components/cms/CmsElementImage.vue -->

<script setup lang="ts">
import { CmsElementImage, useCmsElementImage } from "@shopware/composables";

const props = defineProps<{
  content: CmsElementImage;
}>();

const {
  containerStyle, // padding, background-color etc.
  displayMode, // cover, contain, stretch etc.
  imageAttrs, // automatically resolves src, alt and srcset attributes
} = useCmsElementImage(props.content);
</script>

<template>
  <div :style="containerStyle">
    <img v-bind="imageAttrs" />
  </div>
</template>
