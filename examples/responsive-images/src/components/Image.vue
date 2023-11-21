<script setup lang="ts">
import { computed } from "vue";
import { useProductSearch } from "@shopware-pwa/composables-next/dist";

const { search } = useProductSearch();
// look for some product
const productResponse = await search("0ca329b216cc4f7897973659ecbd68bf", {
  withCmsAssociations: true,
});
const product = computed(() => productResponse.product);
// get the cover media object
const coverMedia = product.value.cover?.media;
// prepare `srcset` string for available thumbnails
// let the breakpoints be for every width range
const srcset = coverMedia?.thumbnails
  ?.map((thumb) => `${thumb.url} ${thumb.width}w`)
  .join(", ");
</script>
<template>
  <img
    :srcSet="srcset"
    :src="coverMedia?.url"
    :alt="coverMedia?.alt"
    :title="coverMedia?.title"
  />
</template>
