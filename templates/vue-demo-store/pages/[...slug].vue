<script setup lang="ts">
import { pascalCase } from "scule";
import { resolveComponent } from "vue";
import type { Ref } from "vue";
import { FrontendNavigationPage } from "#components";
import { useNavigationContext, useNavigationSearch } from "#imports";
import type { Schemas } from "#shopware";

defineOptions({
  name: "PageResolver",
});

const { clearBreadcrumbs } = useBreadcrumbs();

const NOT_FOUND_COMPONENT = "errors/RoutingNotFound";
const { resolvePath } = useNavigationSearch();
const route = useRoute();
const { locale } = useI18n();
const routePath = route.path.replace(`${locale.value}`, "").replace("//", "/");
const { search } = useCategorySearch();

const { data } = await useAsyncData(`cmsResponse${routePath}`, async () => {
  console.warn("useAsyncData", `cmsResponse${routePath}`, route.query);
  if (import.meta.client) {
    // For client links if the history state contains seo url information we can omit the api call
    if (history.state?.routeName) {
      return {
        routeName: history.state?.routeName,
        foreignKey: history.state?.foreignKey,
      };
    }
  }
  console.warn("resolvePath", routePath);
  const seoResponse = await resolvePath(routePath);

  const seoUrl = ref(seoResponse);

  console.warn("seoUrl", seoUrl);
  if (!seoUrl.value) {
    return;
  }

  //useNavigationContext(seoUrl);

  // console.warn("routeName", routeName, foreignKey);

  const categoryResponse1 = await search(seoUrl.value.foreignKey, {
    withCmsAssociations: true,
    query: {
      ...route.query,
    },
  });

  console.warn("categoryResponse1", categoryResponse1.seoUrls);

  return {
    categoryResponse: categoryResponse1,
    // breadcrumbs:
    //   responses[1].status === "fulfilled" ? responses[1].value : null,
  };
});

const { category } = useCategory(
  data?.value?.categoryResponse as unknown as Ref<Schemas["Category"]>,
);

createCategoryListingContext();

// if (!seoResult.value?.foreignKey) {
//   console.error("[...all].vue:", `No data found in API for ${routePath}`);

//   throw createError({
//     statusCode: 404,
//     statusMessage: `No data fetched from API for ${routePath}`,
//   });
// }

onBeforeRouteLeave(() => {
  //clearBreadcrumbs();
});
</script>

<template>
  <div :key="route.path">
  {{ route.path }} {{ route.query }}
  <CmsPage v-if="category?.cmsPage" :content="category.cmsPage" />
  </div>
  
</template>
