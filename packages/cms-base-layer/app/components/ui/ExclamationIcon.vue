<script setup lang="ts">
import ExclamationCircleSvg from "@cms-assets/icons/exclamation-circle.svg";

const { size = 24 } = defineProps<{
  size?: number;
}>();
</script>

<template>
  <SwBaseIcon :src="ExclamationCircleSvg" :size="size" alt="" />
</template>
