---
head:
  - - meta
    - name: og:title
      content: Integrations - Multi CMS - Shopware Frontends
  - - meta
    - name: og:description
      content: "Multi CMS instance"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Multi%20CMS?fontSize=150px"
---

# Multi CMS

Adding a New CMS Instance in Conjunction with Shopware CMS
This documentation segment guides users through the process of incorporating an additional CMS instance and use it seamlessly with the Shopware CMS.

:::warning
This example is written for the vue-demo-store template
:::

## Adding middleware

Add middleware injection to the main routing resolver file.

`templates/vue-demo-store/pages/[...all].vue`

```ts{16-23,46-54,61-66}
import { resolveComponent } from "vue";
import type { Ref } from "vue";
import { pascalCase } from "scule";
import {
  useNavigationContext,
  useNavigationSearch,
} from "@shopware-pwa/composables-next";
import type { Schemas } from "#shopware";
const { clearBreadcrumbs } = useBreadcrumbs();

const NOT_FOUND_COMPONENT = "errors/RoutingNotFound";
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
  "cmsResponse" + routePath,
  async () => {
    // For client links if the history state contains seo url information we can omit the api call
    if (process.client) {
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
  seoResult as Ref<Schemas['SeoUrl']>,
);

/**
 * If there is no Shopware CMS component and an additional CMS
 * resolver is available, fetch content
 */
const componentName = routeName.value;
const path = routePath.substring(1);
if (!componentName && cmsPageRenderer) {
  cmsPageRendererComponent = await cmsPageRenderer(path);
}

onBeforeRouteLeave(() => {
  clearBreadcrumbs();
});

function render() {
    /**
     * Render additional CMS component if exists
     */
    if (cmsPageRendererComponent) {
        return cmsPageRendererComponent;
    }

    if (!componentName)
        return h("div", h(resolveComponent(pascalCase(NOT_FOUND_COMPONENT))));

    const componentNameToResolve = pascalCase(componentName as string);
    const cmsPageView = routeName && resolveComponent(componentNameToResolve);
    if (cmsPageView) {
        if (cmsPageView === componentNameToResolve)
        return h("div", {}, "Problem resolving component: " + componentName);
        return h("div", h(cmsPageView, { navigationId: foreignKey.value }));
    }
    return h("div", {}, "Loading...");
}
```
