<script setup lang="ts">
import CheckmarkFilledSvg from "@cms-assets/icons/check-circle.svg";
import CheckmarkSvg from "@cms-assets/icons/checkmark.svg";

const { filled = false, size = 24 } = defineProps<{
  filled?: boolean;
  size?: number;
}>();
</script>

<template>
  <NuxtImg
    :src="filled ? CheckmarkFilledSvg : CheckmarkSvg"
    alt=""
    :width="size"
    :height="size"
  />
</template>
