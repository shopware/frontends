<script setup lang="ts">
const $props = defineProps(["content"]);
const getSlots = computed(() => $props.content?.slots || []);
</script>
<template>
  <div class="container mx-auto">
    <CmsGenericElement
      v-for="slot in getSlots"
      :key="slot._uniqueIdentifier"
      :content="slot"
      class="cms-block-text-teaser"
    />
  </div>
</template>