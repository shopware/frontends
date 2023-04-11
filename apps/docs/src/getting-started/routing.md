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

In the [building a navigation](./navigation.md) chapter you have already learned how to create a menu structure for your frontend. In this chapter you will learn how to resolve the paths of each menu item, so that users can navigate the store. Specifically, you will learn how to

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

## Next steps

<PageRef page="cms/content-pages" title="Create content pages" sub="Integrate routing and Shopping Experiences" />
<PageRef page="e-commerce/product-listing" title="Create a product listing" sub="Display a list of products" />
