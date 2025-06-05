<script setup lang="ts">
import type { CmsBlockTextTeaserSection } from "@shopware/composables";

defineProps<{
  content: CmsBlockTextTeaserSection;
}>();
</script>
<template>
  <div class="mx-auto grid md:grid-cols-3 gap-4 py-6">
    <CmsGenericElement
      v-for="(slot, i) in content.slots"
      :key="slot.id"
      :content="slot"
      class="cms-block-text-teaser-section"
      :class="{
        'md:col-span-1': i === 0,
        'md:col-span-2': i === 1,
      }"
    />
  </div>
</template>
