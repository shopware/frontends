<script setup lang="ts">
// Gallery block: a responsive grid of Sanity images rendered with <SanityImage>.
defineProps<{
  section: {
    heading?: string;
    images?: Array<{ _key?: string; asset?: { _ref?: string } }>;
  };
}>();
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 py-16">
    <h2
      v-if="section.heading"
      class="mb-10 text-center font-display text-4xl font-bold tracking-tight"
    >
      {{ section.heading }}
    </h2>
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-6">
      <div
        v-for="(image, i) in section.images || []"
        :key="image._key || i"
        class="group relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card"
      >
        <SanityImage
          v-if="image.asset?._ref"
          :asset-id="image.asset._ref"
          auto="format"
          width="800"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
    </div>
  </section>
</template>
