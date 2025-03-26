<script setup lang="ts">
import type { Schemas } from "@shopware/api-client/api-types";
import { getProductName } from "@shopware/helpers";

const { search } = useProductSearch();
const { pushBreadcrumb, breadcrumbs } = useBreadcrumbs();
pushBreadcrumb({
  name: "Home",
  path: "/",
});

const { navigationElements, loadNavigationElements } = useNavigation();

const demoProduct = ref<Schemas["Product"]>();

onMounted(async () => {
  loadNavigationElements({});
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
provideCartSidebar();
</script>

<template>
  <div class="flex min-h-screen flex-col x">
    <LayoutTopMenu />
    <LayoutTopHeader />
    <LayoutNavigationMenu :navigationElements="navigationElements" />
    <main class="flex-1 bg-surface-surface">
      <LayoutBreadcrumbs :breadcrumbs="breadcrumbs" />
      <ProductProductDetailPage v-if="demoProduct" :product="demoProduct" />
    </main>
    
    <CartSidebar :initialItems="[]" />
  </div>
  <NuxtPage />
</template>
