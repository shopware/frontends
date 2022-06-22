<script setup lang="ts">
import SwProductAddToCart from "../../SwProductAddToCart.vue"
import SwVariantConfigurator from "../../SwVariantConfigurator.vue"
import SwProductGallery from "../../SwProductGallery.vue";
import SwProductPrice from "../../SwProductPrice.vue";
const $props = defineProps({
  content: Object,
});
const buyBoxContent = computed(() => $props.content?.slots?.find(({ type }) => type === "buy-box"))
const imageGalleryContent = computed(() => $props.content?.slots?.find(({ type }) => type === "image-gallery"))

const cmsPageResponse = inject("cms-page");
const product = computed(() => cmsPageResponse.value?.product || buyBoxContent.value?.data?.product || {});
</script>
<template>
    <div class="container mx-auto flex flex-row">
        <div class="mt-6 mb-8 rounded-lg overflow-hidden lg:pr-8 basis-4/6">
            <SwProductGallery :product="product" />
        </div>
        <div class="mt-6 mb-9 basis-2/6">
            <h2 class="sr-only">Product information</h2>
            <SwProductPrice :product="product"/>
            <SwVariantConfigurator :product="product"/>
            <SwProductAddToCart :product="product" />
        </div>
    </div>
</template>
