<script setup>
const $props = defineProps(["content"]);
const getSlots = computed(() => $props.content?.slots || []);
const getLeftContent = computed(() =>
  getSlots.value.find((slot) => slot.slot === "left")
);
const getRightContent = computed(() =>
  getSlots.value.find((slot) => slot.slot === "right")
);
</script>
<template>
  <div
    class="cms-block-image-text flex flex-col md:flex-row container mx-auto mb-8 mt-8"
  >
    <div class="md:basis-1/2 self-center">
      <CmsGenericElement :content="getLeftContent" />
    </div>
    <div class="md:basis-1/2 md:pl-8">
      <CmsGenericElement :content="getRightContent" />
    </div>
  </div>
</template>
