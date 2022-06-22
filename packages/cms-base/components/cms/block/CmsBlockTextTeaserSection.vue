<script setup lang="ts">
const $props = defineProps(["content"]);
const getSlots = computed(() => $props.content?.slots || []);
</script>
<template>
  <div class="container mx-auto flex pt-6 pb-6">
    <CmsGenericElement
      v-for="(slot, i) in getSlots"
      :key="slot._uniqueIdentifier"
      :content="slot"
      class="cms-block-text-teaser-section flex"
      :class="{'flex-basis-1/3 flex-col ': i == 0, 'pl-4 flex-basis-2/3': i == 1}"
    />
  </div>
</template>