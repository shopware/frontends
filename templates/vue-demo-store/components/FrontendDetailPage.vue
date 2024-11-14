<script setup lang="ts">
import { getProductName } from "@shopware-pwa/helpers-next";

const props = defineProps<{
  navigationId: string;
}>();

const { search } = useProductSearch();
const { buildDynamicBreadcrumbs, pushBreadcrumb, getCategoryBreadcrumbs } =
  useBreadcrumbs();

const { data, error } = await useAsyncData(
  "cmsProduct" + props.navigationId,
  async () => {
    const [productResponse, breadcrumbs] = await Promise.all([
      search(props.navigationId, {
        withCmsAssociations: true,
        associations: {
          seoUrls: {},
        },
      }),
      getCategoryBreadcrumbs(props.navigationId).catch(() => {
        console.error("Error while fetching breadcrumbs");
      }),
    ]);

    return { productResponse, breadcrumbs };
  },
);
const productResponse = ref(data.value?.productResponse);

if (data.value?.breadcrumbs) {
  buildDynamicBreadcrumbs(data.value.breadcrumbs);
}

if (!productResponse.value) {
  console.error("[FrontendDetailPage.vue]", error.value?.message);
  throw error.value;
}

useProductJsonLD(productResponse.value.product);

pushBreadcrumb({
  name: getProductName({ product: productResponse.value.product }) ?? "",
  path: `/${productResponse.value.product.seoUrls?.[0]?.seoPathInfo}`,
});

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
