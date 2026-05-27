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
  console.error("[FrontendLandingPage.vue]", error.value?.message);
  throw createError({
    statusCode: 500,
    message: error.value?.message,
  });
}

useBreadcrumbs(getCmsBreadcrumbs(landingResponse.value));

const landingPage = computed(() => {
  if (!landingResponse.value) {
    throw createError({
      statusCode: 500,
      message: error.value?.message,
    });
  }
  return landingResponse.value;
});
useCmsHead(landingPage, { mainShopTitle: "Shopware Frontends Demo Store" });
</script>

<template>
  <LayoutBreadcrumbs />
  <CmsPage v-if="landingResponse?.cmsPage" :content="landingResponse.cmsPage" />
  <div v-else class="container mx-auto bg-white flex flex-col">
    <span>😱 cmsPage is missing.</span>
  </div>
</template>
