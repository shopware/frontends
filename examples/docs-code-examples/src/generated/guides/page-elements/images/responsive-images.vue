<script setup lang="ts">
import type { Schemas } from "#shopware";

const product = {} as Schemas["Product"];

// Get the cover media image (main image for a product).
const coverMedia = product.cover?.media;

// Prepare srcset string for available thumbnails. Let the breakpoints be for every width range.
const srcset = coverMedia?.thumbnails
  ?.map((thumb) => `${thumb.url} ${thumb.width}w`)
  .join(", ");
</script>

<template>
  <img
    :srcset="srcset"
    :src="coverMedia?.url"
    :alt="coverMedia?.alt"
    :title="coverMedia?.title"
  />
</template>
