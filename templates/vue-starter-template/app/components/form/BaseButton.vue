<script lang="ts" setup>
defineSlots<{
  default(): unknown;
}>();

defineProps<{
  label: string;
}>();
</script>
<template>
  <button
    class="px-4 py-3 bg-brand-primary rounded inline-flex justify-center items-center gap-1 disabled:bg-surface-surface-disabled disabled:bg-text-bg-surface-surface-disabled"
  >
    <div
      class="justify-start text-white text-base font-bold font-['Inter'] leading-normal"
    >
      <slot> {{ label }}</slot>
    </div>
  </button>
</template>
