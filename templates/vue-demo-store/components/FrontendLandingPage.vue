<script setup lang="ts">
import { useLandingSearch } from "@shopware-pwa/composables-next";
import type { LandingPage } from "@shopware-pwa/types";

const props = defineProps<{
  navigationId: string;
}>();

const { search } = useLandingSearch();

const { data: landingResponse } = await useAsyncData(
  "cmsLanding" + props.navigationId,
  async () => {
    const landingPage = await search(props.navigationId, {
      withCmsAssociations: true,
    });
    return landingPage;
  },
);

if (typeof landingResponse?.value !== null) {
  const landingPage = landingResponse as Ref<LandingPage>;
  useCmsHead(landingPage, { mainShopTitle: "Shopware Frontends Demo Store" });
}
</script>

<template>
  <LayoutBreadcrumbs />
  <CmsPage v-if="landingResponse?.cmsPage" :content="landingResponse.cmsPage" />
</template>
