<script setup lang="ts">
defineProps<{
  step: number;
  label: string;
}>();

defineSlots<{
  default: () => VNode;
}>();
</script>
<template>
  <div class="mb-10">
    <div
      class="flex items-center gap-4 pb-2 border-b border-outline-outline mb-8"
    >
      <div
        class="flex items-center justify-center w-12.5 h-12.5 rounded-full bg-brand-secondary text-on-secondary text-2xl font-normal leading-normal"
      >
        {{ step }}
      </div>
      <div class="justify-start text-[#1d1b20] text-2xl leading-9">
        {{ label }}
      </div>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>
