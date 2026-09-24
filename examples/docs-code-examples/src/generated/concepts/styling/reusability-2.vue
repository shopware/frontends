<!-- ImageContainer.vue -->
<script setup lang="ts">
defineProps<{ images: string[] }>();
</script>

<template>
  <ImageCircle v-for="image in images" :key="image" :image-src="image" />
</template>
