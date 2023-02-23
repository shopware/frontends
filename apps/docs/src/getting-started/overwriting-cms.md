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

# Overwrite CMS blocks in Nuxt 3 app

To override CMS blocks in the Nuxt 3 app, create a `.vue` file with the cms block name in the components directory.
Because of auto importing, CMS component import will be overwritten by the new file path.

More about auto imports can be found [here](https://nuxt.com/docs/guide/concepts/auto-imports)

## Generic CMS components

Generic components are responsible for resolving each CMS element

- [CmsGenericElement.vue](https://github.com/shopware/frontends/blob/main/packages/cms-base/components/public/cms/CmsGenericElement.vue)
- [CmsGenericBlock.vue](https://github.com/shopware/frontends/blob/main/packages/cms-base/components/public/cms/CmsGenericBlock.vue)
