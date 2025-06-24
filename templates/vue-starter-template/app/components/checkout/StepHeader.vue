<script setup lang="ts">
defineProps<{
  step: number;
  label: string;
}>();
</script>
<template>
  <div class="flex items-center gap-4">
    <div
      class="flex items-center justify-center w-12.5 h-12.5 rounded-full bg-brand-secondary text-on-secondary text-2xl font-normal leading-normal"
    >
      {{ step }}
    </div>
    <div class="justify-start text-[#1d1b20] text-2xl leading-9">
      {{ label }}
    </div>
  </div>
</template>
