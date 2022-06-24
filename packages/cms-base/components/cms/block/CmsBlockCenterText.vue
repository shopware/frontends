<script setup>
const $props = defineProps(["content"]);
const getSlots = computed(() => $props.content?.slots || []);
const getLeftContent = computed(() =>
  getSlots.value.find((slot) => slot.slot === "left")
);
const getCenterContent = computed(() =>
  getSlots.value.find((slot) => slot.slot === "center")
);
const getRightContent = computed(() =>
  getSlots.value.find((slot) => slot.slot === "right")
);
</script>
<template>
  <article
    class="cms-block-center-text flex flex-col md:flex-row container mx-auto mb-8 mt-8"
  >
    <div class="">
      <CmsGenericElement :content="getLeftContent" />
    </div>
    <div class="pl-4 pr-4">
      <CmsGenericElement :content="getCenterContent" />
    </div>
    <div class="">
      <CmsGenericElement :content="getRightContent" />
    </div>
  </article>
</template>
