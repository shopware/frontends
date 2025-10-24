<script setup lang="ts">
import ChevronSvg from "@cms-assets/chevron.svg";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    direction?: "up" | "down" | "left" | "right";
    size?: number;
  }>(),
  {
    direction: "down",
    size: 24,
  },
);

const rotationClass = computed(() => {
  const rotations = {
    down: "",
    up: "rotate-180",
    left: "rotate-90",
    right: "-rotate-90",
  };
  return rotations[props.direction];
});
</script>

<template>
  <img
    :src="ChevronSvg"
    alt=""
    :class="['transition-transform', rotationClass]"
    :style="{ width: `${size}px`, height: `${size}px` }"
  />
</template>
