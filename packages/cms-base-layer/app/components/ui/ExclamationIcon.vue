<script setup lang="ts">
import ExclamationCircleSvg from "@cms-assets/icons/exclamation-circle.svg";

withDefaults(
  defineProps<{
    size?: number;
  }>(),
  {
    size: 24,
  },
);
</script>

<template>
  <NuxtImg
    :src="ExclamationCircleSvg"
    alt=""
    :width="size"
    :height="size"
  />
</template>
