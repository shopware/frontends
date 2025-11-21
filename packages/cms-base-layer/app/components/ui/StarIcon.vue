<script setup lang="ts">
import StarEmptySvg from "@cms-assets/icons/star-empty.svg";
import StarFilledSvg from "@cms-assets/icons/star-filled.svg";

const { filled = true, size = 20 } = defineProps<{
  filled?: boolean;
  size?: number;
}>();
</script>

<template>
  <NuxtImg
    :src="filled ? StarFilledSvg : StarEmptySvg"
    alt=""
    :width="size"
    :height="size"
  />
</template>
