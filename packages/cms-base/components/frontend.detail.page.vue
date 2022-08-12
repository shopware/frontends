<script setup lang="ts">
import SwStaticProduct from "./SwStaticProduct.vue";
import { useCms } from "@shopware-pwa/composables-next";
import { CmsProductPageResponse } from "@shopware-pwa/types";

const { cmsContent, page } = useCms();
const product = computed(
  () => (cmsContent.value as CmsProductPageResponse)?.product
);
const isStaticLayout = computed(() => !page?.value);
</script>
<template>
  <div class="container mx-auto bg-white flex flex-col">
    <template v-if="isStaticLayout">
      <SwStaticProduct :product="product" />
    </template>
    <template v-else>
      <CmsPage :content="page" />
    </template>
  </div>
</template>
