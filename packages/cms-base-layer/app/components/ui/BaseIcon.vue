<script setup lang="ts">
const {
  src,
  size = 24,
  alt = "",
} = defineProps<{
  src: string;
  size?: number;
  alt?: string;
}>();
</script>

<template>
  <NuxtImg :src="src" :alt="alt" :width="size" :height="size" />
</template>
