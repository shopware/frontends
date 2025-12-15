<script setup lang="ts">
import UserSvg from "@cms-assets/icons/user.svg";

const { size = 24 } = defineProps<{
  size?: number;
}>();
</script>

<template>
  <SwBaseIcon :src="UserSvg" :size="size" alt="User" />
</template>
