---
head:
  - - meta
    - name: og:title
      content: "Work with routing"
  - - meta
    - name: og:description
      content: "Understand which tools for routing Shopware Frontends provides"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Work%20with%20**Routing**.png?fontSize=150px"
---

# Work with routing

In the [building a navigation](./page-elements/navigation.md) chapter you have already learned how to create a menu structure for your frontend. In this chapter you will learn how to resolve the paths of each menu item, so that users can navigate the store. Specifically, you will learn how to

- Resolve a path string to a route configuration
- Resolve a route configuration to its page or entity

## Resolve a URL path to a route

In Shopware, the concept of routing is connected to `SeoUrl` routes. A `SeoUrl` contains information about the path and what page it resolves to.

In the most common routing scenario, you will have a URL path like `/Winter-Season/My-Product` and want to resolve it to a route configuration. The `useNavigationSearch` composable provides a function to do that:

```js
import {
  useNavigationContext,
  useNavigationSearch,
} from "@shopware-pwa/composables-next";

const { resolvePath } = useNavigationSearch();

const seoResult = await resolvePath("/Winter-Season/My-Product");

const { routeName, foreignKey } = useNavigationContext(ref(seoResult));
```

The result of the `resolvePath` function is a reduced `SeoUrl` object, which you can access safely via the useNavigationContext composable.

```json
{
  "routeName": "frontend.detail.page",
  "foreignKey": "f2f6b6b3a0a04e2a8b0f8a2b2b5b5b1a"
}
```

This is all information you need to resolve the route to a page, or rather an entity.

### 💡 Typescript autocompletion

In routing, a bit of IDE support can go a long way, so follow these steps to get autocompletion within your project.

```bash
npm install -D @shopware-pwa/types
```

and use

```ts
import { SeoUrl } from "@shopware-pwa/types";
```

in your components or composables.

## Resolve a route to a page

There are three different type of routes that Shopware natively supports. When there are extensions active in your store, there can be more. The three types are:

- `frontend.detail.page` - A product detail page
- `frontend.navigation.page` - A category page
- `frontend.landing.page` - A landing page

Depending on which type of route you have, the way of fetching the page data is different - because routes don't point to pages. They point to entities that are used to render pages.

Possibly, the easiest approach is to set up a catch-all component, that resolves the route and then renders the correct page component. This is how it could look like:

```ts
import { SeoUrl } from "@shopware-pwa/types";

import {
  useNavigation,
  useNavigationContext,
  useNavigationSearch,
  useCategorySearch,
} from "@shopware-pwa/composables-next";

const seoResult: SeoUrl | null = await resolvePath(route.path);

const { routeName, foreignKey } = useNavigationContext(ref(seoResult));

const data = ref(null);

switch (routeName.value) {
  case "frontend.navigation.page":
    let { search: categorySearch } = useCategorySearch();
    const categoryResponse = await categorySearch(foreignKey.value, {
      withCmsAssociations: true,
    });
    const { category } = useCategory(categoryResponse);
    data.value = category;
    break;
  case "frontend.detail.page":
    let { search: productSearch } = useProductSearch();
    const productResponse = await productSearch(foreignKey.value, {
      withCmsAssociations: true,
    });
    const { product } = useProduct(productResponse);
    data.value = product;
    break;
  case "frontend.landing.page":
    let { search: landingSearch } = useLandingSearch();
    const landing = await landingSearch(foreignKey.value, {
      withCmsAssociations: true,
    });
    data.value = ref(landing);
    break;
}
```

This switch statement handles all options that Shopware natively supports and can easily be enhanced. Another option is to build custom components for each route type and do the rest in there.

:::tip Module imports
If you use the `@shopware-pwa/nuxt3-module`, all composables will be automatically imported for you.
:::

You are done at this point if you choose to build/design custom pages or integrate an external CMS system for the page content.

## Omiting store API calls for seoURLs

To create speaking links for products or categories, you must know the `seoPathInfo` from the `seoURLs` object. In some situations, you only have the ID of the product or category and then you may need to make an additional call to get the speaking link. This call costs time and can be omitted.

We have created two new helper functions that can be used to avoid these extra calls. Just use `getCategoryRoute` ([see GitHub](https://github.com/shopware/frontends/blob/main/packages/helpers/src/category/getCategoryRoute.ts)) and `getProductRoute` ([see GitHub](https://github.com/shopware/frontends/blob/main/packages/helpers/src/product/getProductRoute.ts)) from [packages/helpers](https://github.com/shopware/frontends/tree/main/packages/helpers). Use them in combination of `RouterLink` or `NuxtLink` in Vue.js or Nuxt.js projects.

##### Example getCategoryRoute with NuxtLink

```vue
<script setup lang="ts">
import { getCategoryRoute } from "@shopware-pwa/helpers-next";
</script>

<template>
  <NuxtLink :to="getCategoryRoute(navigationChild)">
    {{ getTranslatedProperty(navigationChild, "name") }}
  </NuxtLink>
</template>
```

##### Example getProductRoute with RouterLink

```vue
<script setup lang="ts">
import { getProductRoute } from "@shopware-pwa/helpers-next";
</script>

<template>
  <RouterLink :to="getProductRoute(product)">
    {{ getTranslatedProperty(product, "name") }}
  </RouterLink>
</template>
```

##### How does "Omiting store API calls for seoURLs" work in detail?

Several things happen during a request. It should be noted that some operations take place on the server side and some on the client side. Also, data can be passed from the server side to the client side and reused there without the need for a new request. Check the documentation about [useAsyncData](https://nuxt.com/docs/api/composables/use-async-data) in a Nuxt environment.

> Simplified process
>
> 1. The user loads an arbitrary page (we don't know which one it is)
> 2. The server-side rendering (SSR) always happens first and that's where we need to resolve the page, as you learned [above](#resolve-a-route-to-a-page). You will see in the developer tools (network tab) that we load the CMS data (seoURL is included in the response) from the store API.
> 3. After the initial loading (as described in 1 and 2), we already show speaking links to the user. From now on, we don't need to call the store API endpoint for seo-urls, because we already have the data we need. So we simply return it to the user via the [History State API](https://developer.mozilla.org/en-US/docs/Web/API/History/state). This is why we use the helpers always in our demo-store template.

To check it out on a code level have a look at the `[...all].vue` file in the demo-store template.

## Next steps

<PageRef page="cms/content-pages" title="Create content pages" sub="Integrate routing and Shopping Experiences" />
<PageRef page="e-commerce/product-listing" title="Create a product listing" sub="Display a list of products" />
