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

if (!!productResponse.value) {
  const breadcrumbs = getCategoryBreadcrumbs(
    productResponse.value.product.seoCategory, // TODO: [OpenAPI][Product] - seoCategory needs to be defined properly
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
}
</script>
<template>
  <LayoutBreadcrumbs />
  <div class="container mx-auto bg-white flex flex-col">
    <template v-if="!product?.cmsPage">
      <ProductStatic :product="product" />
    </template>
    <template v-else-if="product.cmsPage">
      <CmsPage :content="product.cmsPage" />
    </template>
  </div>
</template>
