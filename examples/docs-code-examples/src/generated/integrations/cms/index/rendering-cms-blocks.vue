<!-- app/components/ExternalCmsPage.vue -->
<script setup lang="ts">
import type { Component } from "vue";

import CmsFeaturedProducts from "./external-cms/CmsFeaturedProducts.vue";
import CmsHero from "./external-cms/CmsHero.vue";
import CmsRichText from "./external-cms/CmsRichText.vue";

defineProps<{
  blocks: Array<{
    id: string;
    type: string;
    props: Record<string, unknown>;
  }>;
}>();

const components: Record<string, Component> = {
  hero: CmsHero,
  richText: CmsRichText,
  featuredProducts: CmsFeaturedProducts,
};
</script>

<template>
  <template v-for="block in blocks" :key="block.id">
    <component
      :is="components[block.type]"
      v-if="components[block.type]"
      v-bind="block.props"
    />
    <div v-else-if="import.meta.dev" class="border border-dashed p-4 text-sm">
      Missing external CMS component: {{ block.type }}
    </div>
  </template>
</template>
