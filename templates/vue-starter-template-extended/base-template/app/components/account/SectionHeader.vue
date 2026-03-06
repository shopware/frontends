<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
<template>
  <div class="pb-2 border-b border-outline-outline">
    <h2 class="text-surface-on-surface font-bold">{{ title }}</h2>
  </div>
</template>
