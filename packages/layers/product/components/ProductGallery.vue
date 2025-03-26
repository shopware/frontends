<script setup lang="ts">
import type { Schemas } from "@shopware/api-client/store-api-types";
import { computed, ref } from "vue";

const props = defineProps<{
  images: Array<Schemas["ProductMedia"]>;
}>();

const selectedImageId = ref(
  props.images.length > 0 ? props.images[0].id : null,
);

const mainImage = computed(() => {
  if (props.images.length === 0) {
    return {
      url: "https://placehold.co/600x600",
      id: "demo",
      alt: "No image available",
    };
  }

  return (
    props.images.find((img) => img.id === selectedImageId.value) ||
    props.images[0]
  );
});

const thumbnails = computed(() => {
  // Assuming all images except the first one are thumbnails
  return props.images.slice(1);
});

const selectImage = (image: Schemas["ProductMedia"]) => {
  selectedImageId.value = image.id;
};
</script>
<template>
  <div class="space-y-4">
    <!-- Main image -->
    <div v-if="mainImage" class="bg-surface-surface border border-outline-outline-variant rounded-sm overflow-hidden">
      <img :src="mainImage.media?.url" :alt="mainImage.media?.alt" class="w-full object-cover" />
    </div>

    <!-- Thumbnails -->
    <div v-if="thumbnails.length > 0" class="grid grid-cols-2 gap-4">
      <div v-for="thumbnail in thumbnails" :key="thumbnail.id"
        class="bg-surface-surface border border-outline-outline-variant rounded-sm overflow-hidden cursor-pointer"
        @click="selectImage(thumbnail)">
        <img :src="thumbnail.media?.url" :alt="thumbnail.media?.alt" class="w-full object-cover" />
      </div>
    </div>
  </div>
</template>
