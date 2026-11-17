---
head:
  - - meta
    - name: og:title
      content: "Overwrite CMS components"
  - - meta
    - name: og:description
      content: "Replace a section, block or element of cms-base-layer with your own component."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Overwrite%20CMS.png"
---

# Overwrite CMS components

`@shopware/cms-base-layer` renders every CMS section, block and element with a component of its own. To replace one, create a component with the same name in your application. Sections, blocks and elements are all overridden the same way.

This applies to the components of `@shopware/cms-base-layer`. If you render CMS pages with your own components, you decide how they are resolved and where they live.

## Where the file goes

CMS components are looked up at runtime with `resolveComponent`, so an override has to sit under a components directory your `nuxt.config.ts` registers with `global: true`. An override anywhere else is never found, and the layer's component keeps rendering with no error.

In `vue-starter-template` that directory is `app/components/cms/`. It is registered with `pathPrefix: false`, so the component name comes from the filename alone and the subdirectory depth under it does not matter.

The [Rendering CMS Pages recipe](../../frontends-recipes/cms/rendering.html) explains the lookup behind this.

## Example: the product listing block

The layer ships this block:
`packages/cms-base-layer/app/components/public/cms/block/CmsBlockProductListing.vue`

To replace it in `vue-starter-template`, create:
`templates/vue-starter-template/app/components/cms/block/CmsBlockProductListing.vue`

## Internal components

❗**Internal components are not a part of public API. Once overwritten you need to track the changes on your own.**

The components shared between blocks and elements, the ones starting with the `Sw` prefix such as [SwSlider.vue](https://github.com/shopware/frontends/blob/main/packages/cms-base-layer/app/components/SwSlider.vue) or [SwProductCard.vue](https://github.com/shopware/frontends/blob/main/packages/cms-base-layer/app/components/SwProductCard.vue), can be overridden too. They are auto-imported rather than resolved at runtime, so in `vue-starter-template` the override goes into `app/components/`. A `SwSharedPrice.vue` there, for example, changes how prices are displayed everywhere the layer shows one: product cards, the product detail page and so on.

## Generic CMS components

`CmsGenericBlock` and `CmsGenericElement` resolve each block and element to its component. When nothing is registered under the expected name, they render the missing-component placeholder in development and nothing in production — see [Implement a Missing CMS Component](missing-component.html).

- [CmsGenericElement.vue](https://github.com/shopware/frontends/blob/main/packages/cms-base-layer/app/components/public/cms/CmsGenericElement.vue)
- [CmsGenericBlock.vue](https://github.com/shopware/frontends/blob/main/packages/cms-base-layer/app/components/public/cms/CmsGenericBlock.vue)
