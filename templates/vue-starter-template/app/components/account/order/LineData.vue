<script setup lang="ts">
const { label, value } = defineProps<{
  label: string;
  value: string | number;
}>();
</script>
<template>
  <div>
    <div
      class="p-4 border-b border-outline-outline-variant text-surface-on-surface font-bold leading-6"
    >
      {{ label }}:
    </div>
    <div class="p-4 leading-6">{{ value }}</div>
  </div>
</template>
