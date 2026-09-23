<script lang="ts" setup>
defineProps<{
  label?: string;
}>();
</script>
<template>
  <button
    type="button"
    class="text-brand-primary gap-1 inline-flex items-center bg-none bg-transparent"
  >
    <slot> {{ label }}</slot>
  </button>
</template>
