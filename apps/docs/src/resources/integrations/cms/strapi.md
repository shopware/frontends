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

[<img src="../../../.assets/cms-icons/Strapi.full.logo.light.png" alt="Strapi Logo" class="mb-8 h-20 hidden dark:block" />](https://docs.strapi.io/dev-docs/intro)
[<img src="../../../.assets/cms-icons/Strapi.full.logo.dark.png" alt="Strapi Logo" class="mb-8 h-20 block dark:hidden" />](https://docs.strapi.io/dev-docs/intro)

Strapi is a headless CMS that can be integrated with the Composable Frontends.
This example requires NUXT 3 instance.

### How to install

Add Strapi Nuxt module as a dev dependencies

```cmd
pnpm add -D @nuxtjs/strapi
```

Update Nuxt config `nuxt.config.ts`

```js
export default {
  modules: ["@nuxtjs/strapi"],
};
```

More about installation can be found [HERE](https://strapi.nuxtjs.org/setup)

### Cases of use

## Fetching and displaying single element

As a example we will add a global banner to our demo shop.
At the beginning we created a single type on the Strapi collection, with fallowing fields

```ts
interface {
  text: string; // short input field - this will represent a text that we want to display in the banner
  color: string; // short input field - this will represent a color of the banner (this can be done also with color picker filed, but for this example we will use input text)
}

```

The next step is to create a banner component

```vue
<script setup lang="ts">
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

Now we can add our component to the layout.
`frontends/templates/vue-demo-store/layouts/default.vue`

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

## Fetching and displaying pages

:::warning
This example is written for the vue-demo-store template and assuming that you [implemented Multiple CMS middleware](../../../getting-started/cms/multiple-cms.md)
:::

Create new collection type `Page` on the Stripe admin site with fields:

```ts
interface {
  text: string; // Content page
  seoUrl: string; // Page slug
}
```

Composable for resolving components

```ts
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

Provide Strapi resolver to the `pageRenderMiddlewares`

```ts
const { resolveComponent } = useSWStrapi();
provide("pageRenderMiddlewares", resolveComponent);
```
