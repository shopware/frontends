---
head:
  - - meta
    - name: og:title
      content: Strapi integration (CMS)
  - - meta
    - name: og:description
      content: "In this chapter you will learn how to integrate Strapi (CMS)."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Strapi%20Integration.png?fontSize=120px"
nav:
  position: 20
---

# Strapi Integration

[<img src="../../.assets/cms-icons/Strapi.full.logo.light.png" alt="Strapi Logo" class="mb-8 h-20 hidden dark:block" />](https://docs.strapi.io/dev-docs/intro)
[<img src="../../.assets/cms-icons/Strapi.full.logo.dark.png" alt="Strapi Logo" class="mb-8 h-20 block dark:hidden" />](https://docs.strapi.io/dev-docs/intro)

Strapi is a headless CMS that can be integrated with the Composable Frontends.
This example requires NUXT 3 instance.

### How to install

Add Strapi Nuxt module as a dev dependencies

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/cms/strapi/how-to-install.cmd" code lang="cmd" no-name -->

```cmd
pnpm add -D @nuxtjs/strapi
```

<!-- /automd -->

Update Nuxt config `nuxt.config.ts`

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/cms/strapi/how-to-install.js" code lang="js" no-name -->

```js
export default {
  modules: ["@nuxtjs/strapi"],
};
```

<!-- /automd -->

More about installation can be found [HERE](https://strapi.nuxtjs.org/setup)

### Cases of use

## Fetching and displaying single element

As a example we will add a global banner to our demo shop.
At the beginning we created a single type on the Strapi collection, with fallowing fields

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/cms/strapi/fetching-and-displaying-single-element.ts" code lang="ts" no-name -->

```ts
interface StrapiBanner {
  text: string; // short input field - this will represent a text that we want to display in the banner
  color: string; // short input field - this will represent a color of the banner (this can be done also with color picker filed, but for this example we will use input text)
}
```

<!-- /automd -->

The next step is to create a banner component

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/cms/strapi/fetching-and-displaying-single-element.vue" code lang="vue" no-name -->

```vue
<script setup lang="ts">
import { computed } from "#imports";
interface GlobalBanner {
  text: string;
  color: string;
}

const { findOne } = useStrapi();

const { data } = await findOne<GlobalBanner>("global-banner");
const bgColor = computed(() => data.attributes?.color || "#fff");
</script>
<template>
  <section>
    <div class="text-center py-1" :style="{ 'background-color': bgColor }">
      {{ data.attributes.text }}
    </div>
  </section>
</template>
```

<!-- /automd -->

Now we can add our component to the layout.
`frontends/templates/vue-starter-template/app/layouts/default.vue`

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/cms/strapi/fetching-and-displaying-single-element-2.vue" code lang="vue" no-name -->

```vue
<template>
  <div>
    <GlobalBanner />
    <LayoutHeader />
    <LayoutNotifications />
    <main class="mx-auto">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>
```

<!-- /automd -->

## Fetching and displaying pages

:::warning
This example is written for the vue-starter-template and assuming that you [implemented Multiple CMS middleware](../../guides/cms/multiple-cms#adding-middleware)
:::

Create new collection type `Page` on the Strapi admin site with fields:

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/cms/strapi/fetching-and-displaying-pages.ts" code lang="ts" no-name -->

```ts
interface StrapiContentPage {
  text: string; // Content page
  seoUrl: string; // Page slug
}
```

<!-- /automd -->

Composable for resolving components

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/cms/strapi/fetching-and-displaying-pages-2.ts" code lang="ts" no-name -->

```ts
import { h, resolveComponent } from "#imports";

interface StripePage {
  text: string;
  seoUrl: string;
}
export function useSWStrapi() {
  const getPage = async (route: string) => {
    const { findOne } = useStrapi();
    const response = await findOne<StripePage>("pages", undefined, {
      filters: {
        seoUrl: route,
      },
    });
    return response;
  };

  const resolveComponent = async (route: string) => {
    const page = await getPage(route);
    if (!page.data[0]) return null;
    return h("div", {}, page.data[0].attributes.text);
  };

  return {
    resolveComponent,
  };
}
```

<!-- /automd -->

Provide Strapi resolver to the `pageRenderMiddlewares`

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/cms/strapi/fetching-and-displaying-pages-3.ts" code lang="ts" no-name -->

```ts
import { provide, resolveComponent } from "#imports";

const { resolveComponent } = useSWStrapi();
provide("pageRenderMiddlewares", resolveComponent);
```

<!-- /automd -->
