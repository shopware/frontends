<template>
  <div class="space-y-4">
    <!-- Main image -->
    <div class="bg-surface-surface border border-outline-outline-variant rounded-sm overflow-hidden">
      <img 
        :src="mainImage.src" 
        :alt="mainImage.alt" 
        class="w-full object-cover"
      />
    </div>
    
    <!-- Thumbnails -->
    <div class="grid grid-cols-2 gap-4">
      <div 
        v-for="thumbnail in thumbnails" 
        :key="thumbnail.id"
        class="bg-surface-surface border border-outline-outline-variant rounded-sm overflow-hidden cursor-pointer"
        @click="selectImage(thumbnail)"
      >
        <img 
          :src="thumbnail.src" 
          :alt="thumbnail.alt" 
          class="w-full object-cover"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
});

// State
const selectedImageId = ref(
  props.images.find((img) => !img.isThumbnail)?.id || props.images[0].id,
);

// Computed properties
const mainImage = computed(() => {
  return (
    props.images.find((img) => img.id === selectedImageId.value) ||
    props.images[0]
  );
});

const thumbnails = computed(() => {
  return props.images.filter((img) => img.isThumbnail);
});

// Methods
const selectImage = (image) => {
  selectedImageId.value = image.id;
};
</script>