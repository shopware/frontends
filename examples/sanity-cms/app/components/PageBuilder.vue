<script setup lang="ts">
import type { Component } from "vue";

import SectionBanner from "./sections/SectionBanner.vue";
import SectionFeaturedProducts from "./sections/SectionFeaturedProducts.vue";
import SectionGallery from "./sections/SectionGallery.vue";
import SectionHero from "./sections/SectionHero.vue";
import SectionRichText from "./sections/SectionRichText.vue";

defineProps<{
  sections: Array<{ _key: string; _type: string; [key: string]: unknown }>;
}>();

// Map each Sanity block `_type` to the component that renders it.
const sectionComponents: Record<string, Component> = {
  hero: SectionHero,
  featuredProducts: SectionFeaturedProducts,
  richText: SectionRichText,
  banner: SectionBanner,
  gallery: SectionGallery,
};
</script>

<template>
  <main>
    <template v-for="section in sections" :key="section._key">
      <component
        :is="sectionComponents[section._type]"
        v-if="sectionComponents[section._type]"
        :id="section._key"
        :section="section"
      />
    </template>
  </main>
</template>
