<script setup lang="ts">
import UserSvg from "@cms-assets/icons/user.svg";

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
    :src="UserSvg"
    alt=""
    :style="{ width: `${size}px`, height: `${size}px` }"
  />
</template>
