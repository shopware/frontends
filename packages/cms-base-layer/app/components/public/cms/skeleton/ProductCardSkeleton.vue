<script setup lang="ts">
import { useImagePlaceholder } from "#imports";

const placeholderSvg = useImagePlaceholder();
</script>

<template>
  <div role="status" class="p-px flex flex-col justify-start items-start overflow-hidden">
    <!-- Image skeleton -->
    <div class="self-stretch min-h-[350px] relative flex items-center justify-center overflow-hidden aspect-square animate-pulse">
      <img
        :src="placeholderSvg"
        alt=""
        aria-hidden="true"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Details skeleton -->
    <div class="w-full pt-4 animate-pulse">
      <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-3/4 mb-3"></div>
      <div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2 mb-4"></div>
      <div class="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-3"></div>
      <div class="h-10 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
    </div>
    <span class="sr-only">Loading...</span>
  </div>
</template>
