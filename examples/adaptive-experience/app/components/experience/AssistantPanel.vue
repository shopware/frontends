<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>

<template>
  <aside
    v-if="message"
    class="border rounded p-4 text-sm"
    data-testid="experience-assistant-panel"
  >
    <!-- Interpolated as text, never as HTML: the message may originate from AI. -->
    {{ message }}
  </aside>
</template>
