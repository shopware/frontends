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
  <NuxtImg
    :src="UserSvg"
    alt=""
    :width="size"
    :height="size"
  />
</template>
