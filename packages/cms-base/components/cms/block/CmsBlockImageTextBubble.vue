<script setup>
const $props = defineProps(["content"]);

const getSlots = computed(() => $props.content?.slots || []);
const getLeftText = computed(() =>
  getSlots.value.find((slot) => slot.slot === "left-text")
);
const getLeftImage = computed(() =>
  getSlots.value.find((slot) => slot.slot === "left-image")
);
const getCenterText = computed(() =>
  getSlots.value.find((slot) => slot.slot === "center-text")
);
const getCenterImage = computed(() =>
  getSlots.value.find((slot) => slot.slot === "center-image")
);
const getRightText = computed(() =>
  getSlots.value.find((slot) => slot.slot === "right-text")
);
const getRightImage = computed(() =>
  getSlots.value.find((slot) => slot.slot === "right-image")
);
</script>
<template>
  <div class="cms-block-image-text-bubble grid grid-cols-3 auto-cols-max">
    <div class="cms-element-column p-4">
      <div class="flex justify-center">
        <CmsGenericElement
          :content="getLeftImage"
          class="object-center rounded-full"
          style="height: calc(100vw / 3 - 64px); width: calc(100vw / 3 - 64px)"
        />
      </div>
      <CmsGenericElement :content="getLeftText" />
    </div>
    <div class="cms-element-column p-4">
      <div class="flex justify-center">
        <CmsGenericElement
          :content="getCenterImage"
          class="object-center rounded-full"
          style="height: calc(100vw / 3 - 64px); width: calc(100vw / 3 - 64px)"
        />
      </div>
      <CmsGenericElement :content="getCenterText" />
    </div>
    <div class="cms-element-column p-4">
      <div class="flex justify-center">
        <CmsGenericElement
          :content="getRightImage"
          class="object-center rounded-full"
          style="height: calc(100vw / 3 - 64px); width: calc(100vw / 3 - 64px)"
        />
      </div>
      <CmsGenericElement :content="getRightText" />
    </div>
  </div>
</template>
