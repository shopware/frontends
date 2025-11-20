<script setup lang="ts">
import StarEmptySvg from "@cms-assets/icons/star-empty.svg";
import StarFilledSvg from "@cms-assets/icons/star-filled.svg";

const { filled = true, size = 20 } = defineProps<{
  filled?: boolean;
  size?: number;
}>();
</script>

<template>
  <img
    :src="filled ? StarFilledSvg : StarEmptySvg"
    alt=""
    :style="{ width: `${size}px`, height: `${size}px` }"
  />
</template>
