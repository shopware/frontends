<script lang="ts" setup>
defineProps<{
  label: string;
}>();
</script>
<template>
  <button
    class="border-b-1 border-b-solid border-b-brand-primary text-brand-primary gap-1 inline-flex items-center bg-none text-sm hover:border-none bg-transparent"
  >
    <slot> {{ label }}</slot>
  </button>
</template>
