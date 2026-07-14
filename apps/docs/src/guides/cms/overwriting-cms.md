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

# Overwrite CMS blocks in Nuxt 3 APP (Nuxt Layer way)

To override CMS blocks in the Nuxt 3 app, create a `.vue` file with the cms block name in the components directory.
Because of auto importing, CMS component import will be overwritten by the new file with the same name.

More about auto imports can be found [here](https://nuxt.com/docs/guide/concepts/auto-imports)

## Example how to overwrite the cms block product listing

We have this cms element **component** from **cms-base package**:  
`packages/cms-base-layer/app/components/public/cms/block/CmsBlockProductListing.vue`

If we want to create our own product listing **component** in **vue-starter-template** the correct place would be:
`templates/vue-starter-template/app/components/cms/block/CmsBlockProductListing.vue`

:::tip HINT 💡

❗**Internal components are not a part of public API. Once overwritten you need to track the changes on your own.**
:::

### Resolving folder structure

**Nuxt** is resolving names by folder structure, so if you have:  
`/components/public/some/name.vue`  
then component name is **PublicSomeName**.

You can repeat folder structure in name like:  
`/components/cms/Name.vue`  
`/components/cms/CmsName.vue`

These are the same components resolving as **CmsName**. 💡

### Internal components

As example: some components use `SwSharedPrice.vue` to show prices with corresponding currency for products in many places like product card, product details page and so on. In order to change the way how the price is displayed consistently - create a one component with a name `SwSharedPrice.vue` and that's it. The new component will be used everywhere where is "imported" (autoimported actually).

### Generic CMS components

Generic components are responsible for resolving each CMS element

- [CmsGenericElement.vue](https://github.com/shopware/frontends/blob/main/packages/cms-base-layer/app/components/public/cms/CmsGenericElement.vue)
- [CmsGenericBlock.vue](https://github.com/shopware/frontends/blob/main/packages/cms-base-layer/app/components/public/cms/CmsGenericBlock.vue)
