<script lang="ts" setup>
defineProps<{
  label: string;
}>();
</script>
<template>
  <span
    class="justify-start leading-normal no-underline text-surface-on-surface hover:underline hover:decoration-brand-primary-hover hover:decoration-2 hover:underline-offset-4 hover:text-brand-primary-hover"
  >
    {{ label }}</span
  >
</template>
