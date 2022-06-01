<script setup lang="ts">
import SwProductGallery from "../../SwProductGallery.vue";

const $props = defineProps({
  content: Object,
});
const product = computed(() => ({
    // create a fake product to have only the media gallery
    media: $props.content?.slots?.[0]?.data?.sliderItems || []
}));
</script>
<template>
    <div class="container mx-auto">
        <SwProductGallery :product="product" />
    </div>
</template>
