<!-- app/components/PageBuilder.vue -->
<script setup lang="ts">
import type { Component } from "vue";

import SectionFeaturedProducts from "./sections/SectionFeaturedProducts.vue";
import SectionHero from "./sections/SectionHero.vue";
// ...

const components: Record<string, Component> = {
  hero: SectionHero,
  featuredProducts: SectionFeaturedProducts,
  // richText, banner, gallery...
};

defineProps<{ sections: Array<{ _key: string; _type: string }> }>();
</script>

<template>
  <component
    :is="components[section._type]"
    v-for="section in sections"
    :key="section._key"
    :section="section"
  />
</template>
