<script setup lang="ts">
import StarEmptySvg from "@cms-assets/star-empty.svg";
import StarFilledSvg from "@cms-assets/star-filled.svg";
import { computed } from "vue";

const { filled = false, size = 16 } = defineProps<{
  filled?: boolean;
  size?: number;
}>();

const starSrc = computed(() => (filled ? StarFilledSvg : StarEmptySvg));
</script>

<template>
  <img
    :src="starSrc"
    alt=""
    :style="{ width: `${size}px`, height: `${size}px` }"
  />
</template>
