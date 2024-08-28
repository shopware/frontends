---
head:
  - - meta
    - name: og:title
      content: Customize Components (CMS)
  - - meta
    - name: og:description
      content: "In this chapter you will learn how to customize a component (CMS)."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Customize%20Components.png?fontSize=120px"
nav:
  position: 30
---

# Customize Components

:::info Only for `cms-base` package
The directory structure is only relevant, if you want to customize the components of the `cms-base` package. If you are using a custom template, you can place components where you want, because you handle their resolution by yourself. In that case skip to [Create Elements](./create-elements).
:::

### Create new files

In order to customize a component, you need to override it. The process is the same regardless what type of component you want to override

- Sections
- Blocks
- Elements

To do so, you need to create a file with the same name as the component in the `components/cms` directory.

```json
demo-store/
├─ components/
|  ├─ cms/
|  ├─ ├─ CmsBlockImageHighlightRow.vue
```

Now the CMS module will automatically resolve that file based on the name and you can start writing your component.

### Additional Example

<PageRef page="overwriting-cms.html" title="Overwrite CMS blocks in Nuxt 3 APP" sub="Example how to overwrite the product card" />
