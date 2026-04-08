---
head:
  - - meta
    - name: og:title
      content: Multiple CMS - Shopware Frontends
  - - meta
    - name: og:description
      content: "Multiple content management systems (CMS)"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Multiple%20CMS?fontSize=150px"
---

# Multiple content management systems (CMS)

Add another [CMS system](../../resources/integrations/cms/), but still use the Shopware Shopping Experiences as a fallback.

This documentation guides users through the process of incorporating an additional CMS instance and use it seamlessly with the Shopware Shopping Experiences.

:::warning
This example is written for the vue-starter-template
:::

## Adding middleware

To add multiple CMS support, you need to inject a middleware into the main routing resolver file.

`templates/vue-starter-template/app/pages/[...all].vue`

```ts{17-24,49-56}
<script setup lang="ts">
import { pascalCase } from "scule";
import { resolveComponent } from "vue";
import type { Ref } from "vue";
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

  if (!componentName)
    return h("div", h("div", {}, "No component found"));

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
```

The key changes are:
- **Lines 17-24**: Inject the `pageRenderMiddlewares` to check for additional CMS resolvers
- **Lines 49-56**: If no Shopware CMS component is found, try to render content from the additional CMS

The `cmsPageRendererComponent` is returned before the regular `cmsPageView` is resolved, but only if it's not null and **no** `componentName` (routeName) is found from Shopware.

Also, you can find a complete example here at [Strapi CMS Integration](../../resources/integrations/cms/strapi).
