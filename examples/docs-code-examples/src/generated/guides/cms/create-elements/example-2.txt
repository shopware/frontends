<!-- components/cms/CmsElementImage.vue -->

<script setup lang="ts">
import { CmsElementImage } from "#imports";
// see above
</script>

<template>
  <img :src="props.content.data.media.url" />
</template>
