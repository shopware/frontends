<script>
import type { Schemas } from "#shopware";
const product: Schemas['Product'] = {} // an object omitted
// get the cover media image (main image for a product)
const coverMedia = product.cover?.media
// prepare `srcset` string for available thumbnails
// let the breakpoints be for every width range
const srcset = coverMedia?.thumbnails?.map((thumb) => `${thumb.url} ${thumb.width}w`).join(", ")
</script>

<template>
   <img
    :srcset="srcset"
    :src="coverMedia?.url"
    :alt="coverMedia?.alt"
    :title="coverMedia?.title"
  >
</template>
