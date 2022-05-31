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
      class="p-4"
    />
    <CmsElementProductCard
      :content="getCenterColumnContent"
      class="p-4"
    />
    <CmsElementProductCard
      :content="getRightColumnContent"
      class="p-4"
    />
  </div>
</template>