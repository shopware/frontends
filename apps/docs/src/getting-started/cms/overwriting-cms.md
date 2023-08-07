---
head:
  - - meta
    - name: og:title
      content: "Overwriting and CMS blocks"
  - - meta
    - name: og:description
      content: "See how to overwrite CMS blocks"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Overwrite%20CMS.png"
---

# Overwrite CMS blocks in Nuxt 3 APP

To override CMS blocks in the Nuxt 3 app, create a `.vue` file with the cms block name in the components directory.
Because of auto importing, CMS component import will be overwritten by the new file path.

More about auto imports can be found [here](https://nuxt.com/docs/guide/concepts/auto-imports)

## Example how to overwrite the cms block product listing

We have this cms element **component** from **cms-base package**:  
`packages/cms-base/components/public/cms/block/CmsBlockProductListing.vue`

If we want to create our own product listing **component** in **demo-store** the correct place would be:
`templates/vue-demo-store/components/cms/block/CmsBlockProductListing.vue`

:::tip HINT 💡
You can only override components that start with Cms. For example, you cannot override SwProductCard (this is an internal component). If you want to have your own SwProductCard, you need to overwrite the Cms component that is using the SwProductCard and then replace it with your e.g. CustomProductCard.
:::

### Resolving folder structure

**Nuxt** is resolving names by folder structure, so if you have:  
`/components/public/some/name.vue`  
then component name is **PublicSomeName**.

You can repeat folder structure in name like:  
`/components/cms/Name.vue`  
`/components/cms/CmsName.vue`

These are the same components resolving as **CmsName**. 💡

### Generic CMS components

Generic components are responsible for resolving each CMS element

- [CmsGenericElement.vue](https://github.com/shopware/frontends/blob/main/packages/cms-base/components/public/cms/CmsGenericElement.vue)
- [CmsGenericBlock.vue](https://github.com/shopware/frontends/blob/main/packages/cms-base/components/public/cms/CmsGenericBlock.vue)
