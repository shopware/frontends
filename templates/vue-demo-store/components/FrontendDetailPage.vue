<script setup lang="ts">
import { useProductSearch } from "@shopware-pwa/composables-next";

const props = defineProps<{
  navigationId: string;
}>();

const { search } = useProductSearch();

const { data: productResponse } = await useAsyncData(
  "cmsProduct" + props.navigationId,
  async () => {
    const productResponse = await search(props.navigationId, {
      withCmsAssociations: true,
    });
    return productResponse;
  }
);
const { product } = useProduct(
  productResponse.value?.product,
  productResponse.value?.configurator
);
</script>
<template>
  <div class="container mx-auto bg-white flex flex-col">
    <template v-if="!product?.cmsPage">
      <ProductStatic :product="product" />
    </template>
    <template v-else-if="product.cmsPage">
      <CmsPage :content="product.cmsPage" />
    </template>
  </div>
</template>
