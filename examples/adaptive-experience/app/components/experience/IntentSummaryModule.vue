<script setup lang="ts">
// Inline concrete shape (mirrors `intentSummaryPropsSchema`): the Vue macro
// cannot resolve a zod `z.infer` alias at compile time.
defineProps<{ headline: string; detail?: string }>();
</script>

<template>
  <section
    class="rounded-lg bg-brand-secondary/40 border border-brand-secondary px-5 py-4 mb-6"
    data-testid="experience-intent-summary"
  >
    <h2 class="text-base font-semibold text-brand-on-secondary m-0">
      {{ headline }}
    </h2>
    <p v-if="detail" class="text-sm text-brand-on-secondary/80 mt-1 m-0">
      {{ detail }}
    </p>
  </section>
</template>
