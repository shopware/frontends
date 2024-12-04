<script setup lang="ts">
import { getCmsBreadcrumbs } from "@shopware-pwa/helpers-next";
import { useLandingSearch } from "#imports";
import type { Schemas } from "#shopware";

const props = defineProps<{
  navigationId: string;
}>();

const { search } = useLandingSearch();

const { data: landingResponse, error } = await useAsyncData(
  `cmsLanding${props.navigationId}`,
  async () => {
    const landingPage = await search(props.navigationId, {
      withCmsAssociations: true,
    });
    return landingPage;
  },
);

if (landingResponse.value) {
  const breadcrumbs = getCmsBreadcrumbs(landingResponse.value);
  useBreadcrumbs(breadcrumbs);
}

if (!landingResponse?.value) {
  console.error("[FrontendLandingPage.vue]", error.value?.message);
  throw error.value;
}

const landingPage = landingResponse as Ref<Schemas["LandingPage"]>;
useCmsHead(landingPage, { mainShopTitle: "Shopware Frontends Demo Store" });
</script>

<template>
  <LayoutBreadcrumbs />
  <CmsPage v-if="landingResponse?.cmsPage" :content="landingResponse.cmsPage" />
</template>
