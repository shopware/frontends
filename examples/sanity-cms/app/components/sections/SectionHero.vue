<script setup lang="ts">
// Hero block: animated gradient backdrop, oversized headline, pill CTA and an
// optional Sanity image floating below.
defineProps<{
  section: {
    eyebrow?: string;
    heading?: string;
    subheading?: string;
    ctaLabel?: string;
    ctaHref?: string;
    image?: { asset?: { _ref?: string } };
  };
}>();
</script>

<template>
  <section class="relative isolate overflow-hidden">
    <div
      class="absolute inset-0 -z-10 animate-gradient-pan bg-gradient-to-br from-indigo-600 via-fuchsia-500 to-cyan-400 bg-[length:200%_200%]"
    />
    <div
      class="absolute inset-0 -z-10 opacity-40 [background:radial-gradient(60%_55%_at_50%_0%,white,transparent)]"
    />

    <div class="mx-auto max-w-6xl px-6 py-24 text-center text-white sm:py-32">
      <p
        v-if="section.eyebrow"
        class="mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur"
      >
        ✨ {{ section.eyebrow }}
      </p>
      <h1
        v-if="section.heading"
        class="animate-fade-up font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl"
      >
        {{ section.heading }}
      </h1>
      <p
        v-if="section.subheading"
        class="mx-auto mt-6 max-w-2xl animate-fade-up text-lg text-white/90 sm:text-xl"
      >
        {{ section.subheading }}
      </p>
      <div v-if="section.ctaLabel" class="mt-10 animate-fade-up">
        <a
          :href="section.ctaHref || '#'"
          class="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-indigo-700 shadow-xl shadow-indigo-900/30 transition hover:-translate-y-0.5 hover:shadow-2xl"
        >
          {{ section.ctaLabel }}
          <span class="transition group-hover:translate-x-1">→</span>
        </a>
      </div>

      <div v-if="section.image?.asset?._ref" class="mt-16">
        <div
          class="mx-auto max-w-4xl animate-float overflow-hidden rounded-3xl border border-white/20 shadow-2xl"
        >
          <SanityImage
            :asset-id="section.image.asset._ref"
            auto="format"
            width="1200"
            class="block w-full"
          />
        </div>
      </div>
    </div>
  </section>
</template>
