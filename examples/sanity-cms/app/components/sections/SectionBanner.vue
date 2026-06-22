<script setup lang="ts">
// Banner / CTA block: a vibrant full-width gradient band with glow accents.
defineProps<{
  section: {
    heading?: string;
    text?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
}>();
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 py-12">
    <div
      class="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-8 py-14 text-center text-white shadow-2xl shadow-fuchsia-500/20 sm:px-16"
    >
      <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div class="absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-cyan-300/20 blur-2xl" />
      <h2
        v-if="section.heading"
        class="relative font-display text-3xl font-bold sm:text-4xl"
      >
        {{ section.heading }}
      </h2>
      <p v-if="section.text" class="relative mx-auto mt-4 max-w-xl text-white/90">
        {{ section.text }}
      </p>
      <a
        v-if="section.ctaLabel"
        :href="section.ctaHref || '#'"
        class="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5"
      >
        {{ section.ctaLabel }} <span>→</span>
      </a>
    </div>
  </section>
</template>
