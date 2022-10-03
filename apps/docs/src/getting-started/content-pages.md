---
head:
  - - meta
    - name: og:title
      content: Building the content pages
  - - meta
    - name: og:description
      content: "In this chapter you will learn how to create a content page and use CMS elements."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Building%20the%20**Content%20Pages**.png?fontSize=120px"
---
# Create content pages

In this chapter you will learn how to

- Fetch a content page
- Resolve the root component of your page
- Use custom CMS components

## Fetch a page

We can retrieve a content page using the `useCms` composable hook.

```js
const { search } = useCms();
const route = useRoute();

let page = await search(route.path); // Has type CmsPageResponse
```

This will return a CMS page result

```ts
export type CmsPageResponse =
  | CmsCategoryPageResponse
  | CmsProductPageResponse
  | CmsStaticPageResponse;
```

which we can further use to build our CMS page.

The nice thing about CMS pages in Shopware, is that they are all built in the same way - based a tree built as sections, blocks and components.

## Resolve the root component

A content page can be one of three types

- Category
- Product
- Static

So as a next step we have to resolve the root component of our tree, which we can deduct from the `resourceType` property of our page response.

The possible values of `resourceType` are

- `frontend.navigation.page`
- `frontend.detail.page`
- `frontend.landing.page`

The example below shows how to resolve the root component of a CMS page based on the `resourceType` property.

:::tip
You can use the `resolveComponent( componentName )` method to [resolve a component](https://vuejs.org/api/render-function.html#resolvecomponent) from a given resource type within your custom render function.
:::

```js
const cmsPage = computed(() => page.value?.cmsPage);

function render() {
  const componentName = page.value?.resourceType;
  const componentNameToResolve = pascalCase(componentName);
  const cmsPageView =
    page.value?.resourceType && resolveComponent(componentNameToResolve);
  if (cmsPageView) {
    if (cmsPageView === componentNameToResolve)
      return h("div", {}, "Problem resolving component: " + componentName);
    return h("div", h(cmsPageView, { cmsPage: cmsPage.value }));
  }
  return h("div", {}, "Loading...");
}
```

The code above will only run, when components with the same name as `resourceType` are available in your project.

TODO: Check correct command how to install the `cms-base` package - is the above event correct?

```sh
pnpm i @shopware-pwa/cms-base
```

## Custom CMS components

The `cms-base` package has an opinionated style of components and is based on Tailwind.css. If you want to use custom components, you can build them right into your project or import them as a separate package.

In order to see how you can build custom CMS components, head to Shopping Experiences

<PageRef page="../framework/shopping-experiences" title="Shopping Experiences" />
