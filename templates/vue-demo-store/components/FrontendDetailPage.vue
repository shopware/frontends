<script setup lang="ts">
import { useProductSearch } from "@shopware-pwa/composables-next";
import { getProductName } from "@shopware-pwa/helpers-next";
import { Category } from "@shopware-pwa/types";

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

const getCategoryBreadcrumbs = (
  category: Category | null | undefined,
  options?: {
    /**
     * Start at specific index if your navigation
     * contains root names which should not be visible.
     */
    startIndex?: number;
  }
) => {
  const breadcrumbs =
    category?.translated?.breadcrumb || category?.breadcrumb || [];
  const startIndex = options?.startIndex || 0;
  if (breadcrumbs.length <= startIndex) return [];
  return breadcrumbs.slice(startIndex).map((element, index) => {
    if (category?.seoUrls?.[0]?.seoPathInfo) {
      return {
        name: element,
        path: '/' + category?.seoUrls?.[0]?.seoPathInfo.split('/').slice(0, index + 1).join('/') + '/'
      };
    }
    return {
      name: element,
    };
  });
}
const breadcrumbs = getCategoryBreadcrumbs(
  productResponse.value?.product.seoCategory,
  {
    startIndex: 2,
  }
);

breadcrumbs.push({
  name: getProductName({product: productResponse.value?.product}) || ''
})

useBreadcrumbs(breadcrumbs);

const { product } = useProduct(
  productResponse.value?.product,
  productResponse.value?.configurator
);

useCmsHead(product, { mainShopTitle: "Shopware Frontends Demo Store" });
</script>
<template>
  <template v-if="!product?.cmsPage">
    <div class="container mx-auto bg-white flex flex-col">
      <ProductStatic :product="product" />
    </div>
  </template>
  <template v-else-if="product.cmsPage">
    <CmsPage :content="product.cmsPage" />
  </template>
</template>
