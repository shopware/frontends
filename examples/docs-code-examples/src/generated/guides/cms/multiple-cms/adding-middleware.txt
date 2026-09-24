<script setup lang="ts">
import { pascalCase } from "scule";
import { resolveComponent } from "vue";
import type { Ref } from "vue";

import { VNode, h, inject, useAsyncData, useRoute } from "#imports";
import { useNavigationContext, useNavigationSearch } from "#imports";
import type { Schemas } from "#shopware";

defineOptions({
  name: "PageResolver",
});

const { resolvePath } = useNavigationSearch();
const route = useRoute();
const { locale } = useI18n();
const routePath = route.path.replace(`${locale.value}`, "").replace("//", "/");

/**
 * Load CMS resolver if exists
 */
let cmsPageRendererComponent: VNode | null = null;
const cmsPageRenderer = inject<((path: string) => VNode | null) | null>(
  "pageRenderMiddlewares",
  null,
);

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

const { routeName, foreignKey } = useNavigationContext(
  seoResult as Ref<Schemas["SeoUrl"]>,
);

const componentName = routeName.value;

/**
 * If there is no Shopware CMS component and an additional CMS
 * resolver is available, fetch content
 */
const path = routePath.substring(1);
if (!componentName && cmsPageRenderer) {
  cmsPageRendererComponent = await cmsPageRenderer(path);
}

function render() {
  /**
   * Render additional CMS component if exists
   */
  if (cmsPageRendererComponent) {
    return cmsPageRendererComponent;
  }

  if (!componentName) return h("div", h("div", {}, "No component found"));

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
