<script setup lang="ts">
defineProps<{
  customerName: string;
  customerEmail: string;
}>();
</script>
<template>
  <div class="flex flex-col gap-2">
    <SharedDataTextRow> {{ customerName }} </SharedDataTextRow>
    <SharedDataTextRow> {{ customerEmail }}</SharedDataTextRow>
  </div>
</template>
