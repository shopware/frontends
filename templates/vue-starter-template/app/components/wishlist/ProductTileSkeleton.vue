<script setup lang="ts">
const ELEMENT_WIDTH = 310;
const ELEMENT_HEIGHT = 315;
</script>
<template>
  <div
    class="flex flex-col gap-4 relative animate-pulse"
    :style="`width: ${ELEMENT_WIDTH}px;`"
  >
    <div
      class="absolute top-4 right-4 h-6 w-6 rounded-full bg-surface-on-surface/10"
    />

    <div
      class="bg-surface-on-surface/10 rounded-lg"
      :style="`height: ${ELEMENT_HEIGHT}px; width: ${ELEMENT_WIDTH}px;`"
    />
    <div class="flex flex-col gap-2">
      <div class="h-7 bg-surface-on-surface/10 rounded w-3/4" />
      <div class="h-7 bg-surface-on-surface/10 rounded w-1/2" />
    </div>

    <div class="mt-auto flex flex-col gap-4">
      <div class="h-6 bg-surface-on-surface/10 rounded w-1/3" />
      <div class="h-10 bg-surface-on-surface/10 rounded" />
    </div>
  </div>
</template>
