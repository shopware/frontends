<script setup lang="ts">
import ChevronSvg from "@cms-assets/icons/chevron.svg";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    direction?: "up" | "down" | "left" | "right";
    size?: number;
    alt?: string;
  }>(),
  {
    direction: "down",
    size: 24,
    alt: "",
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
  <NuxtImg
    :src="ChevronSvg"
    :alt="alt"
    :class="['transition-transform', rotationClass]"
    :width="size"
    :height="size"
  />
</template>
