<script setup lang="ts">
import { useProductSearch } from "#imports";
import { getCategoryBreadcrumbs } from "@shopware-pwa/helpers-next";

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
  },
);

if (!productResponse.value) {
  console.error("No product found for navigationId: " + props.navigationId);
  throw new Error("No product found for navigationId: " + props.navigationId);
}

useProductJsonLD(productResponse.value.product);

const breadcrumbs = getCategoryBreadcrumbs(
  productResponse.value.product.seoCategory,
  {
    startIndex: 2,
  },
);
useBreadcrumbs(breadcrumbs);

const { product } = useProduct(
  productResponse.value.product,
  productResponse.value.configurator,
);

useCmsHead(product, { mainShopTitle: "Shopware Frontends Demo Store" });
</script>

<template>
  <LayoutBreadcrumbs />
  <div v-if="product?.cmsPage" class="container mx-auto bg-white flex flex-col">
    <CmsPage :content="product.cmsPage" />
  </div>
  <div
    v-if="!product?.cmsPage"
    class="container mx-auto bg-white flex flex-col"
  >
    <!-- Since Shopware Version 6.6.0.0 there should be always a cmsPage for products -->
    <span>😱 cmsPage is missing.</span>
  </div>
</template>
