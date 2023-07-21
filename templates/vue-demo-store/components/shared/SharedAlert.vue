<script setup lang="ts">
import {
  ExclamationTriangleIcon
} from '@heroicons/vue/24/solid';

const props = withDefaults(
  defineProps<{
    text: string;
  }>(),
  {
    text: '',
  }
);
</script>

<template>
  <div class="flex items-center bg-amber-50 border-l border-l-4 border-l-amber-400 p-4">
    <ExclamationTriangleIcon class="w-5 h-5 text-amber-400 mr-3" />
    <p class="text-sm text-amber-800 font-medium">
      {{ props.text }}
    </p>
  </div>
</template>