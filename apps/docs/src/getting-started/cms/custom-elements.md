---
head:
  - - meta
    - name: og:title
      content: Custom Elements (CMS)
  - - meta
    - name: og:description
      content: "In this chapter you will learn how to add custom elements"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Custom%20Elements.png?fontSize=120px"
nav:
  position: 10
---

# Custom Elements (CMS)

All custom CMS elements created in the backend require corresponding implementations in the frontend application.

The CMS package utilizes the [resolveComponent](https://vuejs.org/api/render-function#resolvecomponent) method from Vue to identify the component returned by the backend API.
Therefore, the only requirement is to globally register the component with the appropriate name.

## Registration

### Demo store

The demo store utilizes Nuxt 3, which by default registers all components globally. For optimal application structure, we recommend adding the components to the `/components/cms` directory.

### Vue apps

[Global registration](https://vuejs.org/guide/components/registration#global-registration) in Vue apps

```ts
import CmsBlockCustomBlock from "./components/cms/CmsBlockCustomBlock.vue";

app.component("CmsBlockCustomBlock", CmsBlockCustomBlock);
```

## Naming

The component is searched in the global component register by its name.

[Resolving component in CMS package](https://github.com/shopware/frontends/blob/main/packages/composables/src/index.ts#L74)

```js
const componentNameToResolve = pascalCase(`Cms-${type}-${componentName}`);
const resolvedComponent = resolveComponent(componentNameToResolve);
```

```
<prefix><type><name>.vue / CmsBlockCustomBlock.vue
```

Prefix:\
It is always Cms

Type:

- Section
- Block
- Element

Name:\
Should be the same as it was registered on the backend side.
