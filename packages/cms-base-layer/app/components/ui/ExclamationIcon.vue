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
  <img
    :src="ExclamationCircleSvg"
    alt=""
    :style="{ width: `${size}px`, height: `${size}px` }"
  />
</template>
