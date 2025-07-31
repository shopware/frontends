<script setup lang="ts">
import { pascalCase } from "scule";
import { resolveComponent } from "vue";
import type { Ref } from "vue";
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

const { data: seoResult } = await useAsyncData(
  `cmsResponse${routePath}`,
  async () => {
    // For client links if the history state contains seo url information we can omit the api call
    if (import.meta.client) {
      if (history.state?.routeName) {
        return {
          routeName: history.state?.routeName,
          foreignKey: history.state?.foreignKey,
        };
      }
    }
    const seoUrl = await resolvePath(routePath);
    return seoUrl;
  },
);

if (!seoResult.value?.foreignKey) {
  console.error("[...all].vue:", `No data found in API for ${routePath}`);

  throw createError({
    statusCode: 404,
    statusMessage: `No data fetched from API for ${routePath}`,
  });
}

const { routeName, foreignKey } = useNavigationContext(
  seoResult as Ref<Schemas["SeoUrl"]>,
);

const componentName = routeName.value;

onBeforeRouteLeave(() => {
  clearBreadcrumbs();
});

function render() {
  if (!componentName)
    return h("div", h(resolveComponent(pascalCase(NOT_FOUND_COMPONENT))));

  const componentNameToResolve = pascalCase(componentName as string);
  const cmsPageView = routeName && resolveComponent(componentNameToResolve);
  if (cmsPageView) {
    if (cmsPageView === componentNameToResolve)
      return h("div", {}, `Problem resolving component: ${componentName}`);
    return h("div", h(cmsPageView, { navigationId: foreignKey.value }));
  }
  return h("div", {}, "Loading...");
}
</script>

<template>
  <render />
</template>
