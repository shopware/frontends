<script setup lang="ts">
import { getCmsBreadcrumbs } from "@shopware/helpers";

import { useLandingSearch } from "#imports";

const props = defineProps<{
  navigationId: string;
}>();

const { search } = useLandingSearch();

const { data: landingResponse, error } = await useAsyncData(
  `cmsLanding${props.navigationId}`,
  () => search(props.navigationId, { withCmsAssociations: true }),
);

if (!landingResponse.value) {
  const statusMessage = error.value?.message || "No landing page found";
  console.error("[FrontendLandingPage.vue]", statusMessage);
  throw createError({
    statusCode: 500,
    message: statusMessage,
  });
}

const landingPage = landingResponse.value;

useBreadcrumbs(getCmsBreadcrumbs(landingPage));
useCmsHead(
  computed(() => landingPage),
  {
    mainShopTitle: "Shopware Frontends Demo Store",
  },
);
</script>

<template>
  <LayoutBreadcrumbs />
  <CmsPage v-if="landingResponse?.cmsPage" :content="landingResponse.cmsPage" />
  <div v-else class="container mx-auto bg-white flex flex-col">
    <span>😱 cmsPage is missing.</span>
  </div>
</template>
