<script setup lang="ts">
// Inline SVG to support currentColor theming
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 400 400"
    preserveAspectRatio="xMidYMid meet"
    class="w-full h-full object-cover"
    aria-hidden="true"
  >
    <rect width="100%" height="100%" fill="currentColor" opacity="0.1" />
    <g fill="currentColor" opacity="0.2">
      <path d="M170 180h60v40h-60z" />
      <circle cx="180" cy="195" r="8" />
      <path d="M170 220l15-15 10 10 20-20 15 15v10h-60z" />
    </g>
  </svg>
</template>
