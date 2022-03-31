<script setup lang="ts">
import { getProductMediaGallery } from "@shopware-pwa/helpers"

const props = defineProps({
  product: Object,
});

const coverImageUrl = computed(() => props.product?.cover?.media?.url);
const mediaGallery =  computed(() => getProductMediaGallery({ product: props.product }).filter(({desktop}) => desktop?.url !== coverImageUrl.value));
const gallery3columns = computed(() => mediaGallery.value?.length%3 === 0)
</script>

<template>
 <div class="hidden lg:grid lg:grid-cols-1 lg:gap-x-8 lg:gap-y-8 mb-8 rounded-lg overflow-hidden" >
    <img :src="coverImageUrl" class="w-full h-full object-center object-cover">
  </div>
  <div :class='[gallery3columns ? "lg:grid-cols-3": "lg:grid-cols-2"]' class="hidden lg:grid lg:gap-x-8 lg:gap-y-8 rounded-lg overflow-hidden">
    <img v-for="image in mediaGallery" :key="image.desktop.url" :src="image.desktop.url" class="w-full h-full object-center object-cover">
</div>
</template>
