<script setup lang="ts">
// Rich text block: renders Sanity Portable Text. The `prose` classes come from
// the @tailwindcss/typography plugin.
defineProps<{
  section: {
    content?: Array<{ _type: string; _key?: string; [key: string]: unknown }>;
  };
}>();
</script>

<template>
  <section class="mx-auto max-w-3xl px-6 py-16">
    <SanityContent
      v-if="section.content"
      :value="section.content"
      class="prose prose-lg prose-slate mx-auto prose-headings:font-display prose-a:text-fuchsia-600 hover:prose-a:text-fuchsia-700"
    />
  </section>
</template>
