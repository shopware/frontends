<script setup lang="ts">
import CheckmarkFilledSvg from "@cms-assets/icons/check-circle.svg";
import CheckmarkSvg from "@cms-assets/icons/checkmark.svg";

const {
  filled = false,
  size = 24,
  alt = "",
} = defineProps<{
  filled?: boolean;
  size?: number;
  alt?: string;
}>();
</script>

<template>
  <NuxtImg
    :src="filled ? CheckmarkFilledSvg : CheckmarkSvg"
    :alt="alt"
    :width="size"
    :height="size"
  />
</template>
