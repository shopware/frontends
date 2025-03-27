
<script setup lang="ts">
import type { Schemas } from "@shopware/api-client/store-api-types";
import { getProductName } from "@shopware/helpers";
const { search } = useProductSearch();
const { pushBreadcrumb, clearBreadcrumbs } = useBreadcrumbs();
clearBreadcrumbs();
pushBreadcrumb({
  name: "Home",
  path: "/",
});

const demoProduct = ref<Schemas["Product"]>();
onMounted(async () => {
  const productResponse = await search("018bd828d69f72dba59567a17c432eae", {
    associations: {
      media: {},
      seoUrls: {},
    },
  });

  pushBreadcrumb({
    name: getProductName({ product: productResponse.product }) ?? "",
    path: `/${productResponse.product.seoUrls?.[0]?.seoPathInfo}`,
  });
  demoProduct.value = productResponse.product;
});
</script>
<template>
  <ProductProductDetailPage v-if="demoProduct" :product="demoProduct" />
</template>