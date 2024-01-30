<script setup lang="ts">
import { useLandingSearch } from "#imports";
import type { Schemas } from "#shopware";

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
  const landingPage = landingResponse as Ref<Schemas["LandingPage"]>;
  useCmsHead(landingPage, { mainShopTitle: "Shopware Frontends Demo Store" });
}
</script>

<template>
  <LayoutBreadcrumbs />
  <CmsPage v-if="landingResponse?.cmsPage" :content="landingResponse.cmsPage" />
</template>
