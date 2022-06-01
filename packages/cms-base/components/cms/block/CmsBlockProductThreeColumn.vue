<script setup lang="ts">
const $props = defineProps(["content"])

const getSlots = computed(() => $props.content?.slots || []);
const getLeftColumnContent = computed(() => getSlots.value.find(({ slot }) => slot === "left"));
const getCenterColumnContent = computed(() => getSlots.value.find(({ slot }) => slot === "center"));
const getRightColumnContent = computed(() => getSlots.value.find(({ slot }) => slot === "right"));
</script>
<template>
  <div class="flex md:flex-row flex-col container mx-auto">
    <CmsElementProductCard
      :content="getLeftColumnContent"
      class="md:pr-4 w-full"
    />
    <CmsElementProductCard
      :content="getCenterColumnContent"
      class="md:pr-4 w-full"
    />
    <CmsElementProductCard
      :content="getRightColumnContent"
      class="w-full"
    />
  </div>
</template>