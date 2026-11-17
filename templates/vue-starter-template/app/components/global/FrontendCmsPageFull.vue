<script setup lang="ts">
/**
 * Renders a standalone CMS layout from its technical URL `/page/cms/<id>`,
 * the equivalent of the Shopware Storefront route `frontend.cms.page.full`.
 *
 * Layouts that are not assigned to a category or landing page, like the legal
 * pages from the basic information settings, have no SEO URL. Shopware links
 * them by this technical URL, e.g. in `llms.txt`.
 */
import { ApiClientError } from "@shopware/api-client";
import { getCmsBreadcrumbs, getTranslatedProperty } from "@shopware/helpers";

const props = defineProps<{
  navigationId: string;
}>();

const { apiClient } = useShopwareContext();

const { data: cmsPage, error } = await useAsyncData(
  `cmsPageFull${props.navigationId}`,
  async () => {
    try {
      const response = await apiClient.invoke("readCms post /cms/{id}", {
        pathParams: {
          id: props.navigationId,
        },
        body: {},
      });
      return response.data;
    } catch (searchError) {
      if (searchError instanceof ApiClientError && searchError.status === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: "CMS page not found",
        });
      }
      throw searchError;
    }
  },
);

if (error.value) {
  throw error.value;
}

if (!cmsPage.value) {
  console.error("[FrontendCmsPageFull.vue]", "CMS page not found");
  throw createError({
    statusCode: 404,
    statusMessage: "CMS page not found",
  });
}

const page = cmsPage.value;
const pageName = getTranslatedProperty(page, "name");

useBreadcrumbs(getCmsBreadcrumbs(page));
useSeoMeta({
  title: pageName
    ? `${pageName} | Shopware Frontends Demo Store`
    : "Shopware Frontends Demo Store",
  // the Storefront sends `x-robots-tag: noindex` for this route as well
  robots: "noindex",
});
</script>

<template>
  <LayoutBreadcrumbs />
  <CmsPage :content="page" />
</template>
