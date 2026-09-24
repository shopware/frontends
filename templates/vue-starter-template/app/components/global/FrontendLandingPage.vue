<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import { getCmsBreadcrumbs } from "@shopware/helpers";

import { useLandingSearch } from "#imports";

const props = defineProps<{
  navigationId: string;
}>();

const { search } = useLandingSearch();

const { data: landingResponse, error } = await useAsyncData(
  `cmsLanding${props.navigationId}`,
  async () => {
    try {
      return await search(props.navigationId, { withCmsAssociations: true });
    } catch (searchError) {
      if (searchError instanceof ApiClientError && searchError.status === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: "Landing page not found",
        });
      }
      throw searchError;
    }
  },
);

if (error.value) {
  throw error.value;
}

if (!landingResponse.value) {
  console.error("[FrontendLandingPage.vue]", "Landing page not found");
  throw createError({
    statusCode: 404,
    statusMessage: "Landing page not found",
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
