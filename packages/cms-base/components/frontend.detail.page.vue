<script setup lang="ts">
import SwStaticProduct from "./SwStaticProduct.vue";
const cmsPageResponse = inject("cms-page");
const product = computed(() => cmsPageResponse.value.product);
const isStaticLayout = computed(() => !cmsPageResponse.value?.cmsPage);
</script>
<template>
  <div class="container mx-auto bg-white flex flex-row">
    <template v-if="isStaticLayout">
      <SwStaticProduct :product="product" />
    </template>
    <template v-else>
      <CmsPage :content="cmsPageResponse.cmsPage" />
    </template>
  </div>
</template>
