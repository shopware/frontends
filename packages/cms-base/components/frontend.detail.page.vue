<script setup lang="ts">
import SwStaticProduct from "./SwStaticProduct.vue";
import { useCms } from "@shopware-pwa/composables-next";

const { cmsContent, page } = useCms();
const product = computed(() => cmsContent.value?.product);
const isStaticLayout = computed(() => !page?.value);
</script>
<template>
  <div class="container mx-auto bg-white flex flex-row">
    <template v-if="isStaticLayout">
      <SwStaticProduct :product="product" />
    </template>
    <template v-else>
      <CmsPage :content="page" />
    </template>
  </div>
</template>
