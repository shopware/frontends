<script setup lang="ts">
import type { CmsBlockProductSlider } from "@shopware/composables";

defineProps<{
  content: CmsBlockProductSlider;
}>();
</script>
<template>
  <div class="cms-block-product-slider">
    <CmsGenericElement
      v-for="slot in content.slots"
      :key="slot.id"
      :content="slot"
    />
  </div>
</template>
