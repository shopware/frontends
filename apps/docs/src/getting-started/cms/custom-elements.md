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

:::warning
This tutorial is a continuation of example from the backend part. That can be found [here](https://developer.shopware.com/docs/guides/plugins/plugins/content/cms/add-cms-element.html)
:::

All custom CMS elements created in the backend require corresponding implementations in the frontend application.

The CMS package utilizes the [resolveComponent](https://vuejs.org/api/render-function#resolvecomponent) method from Vue to identify the component returned by the backend API.
Therefore, the only requirement is to globally register the component with the appropriate name.

## Registration

### Demo store

The demo store utilizes Nuxt 3, which by default registers all components globally. For optimal application structure, we recommend adding the components to the `/components/cms` directory.

### Vue apps

[Global registration](https://vuejs.org/guide/components/registration#global-registration) in Vue apps

```ts
import CmsBlockCustomBlock from "./components/cms/CmsElementDailymotion.vue";

app.component("CmsElementDailymotion", CmsBlockCustomBlock);
```

## Naming

The component is searched in the global component register by its name.

[Resolving component in CMS package](https://github.com/shopware/frontends/blob/main/packages/composables/src/index.ts#L74)

```js
const componentNameToResolve = pascalCase(`Cms-${type}-${componentName}`);
const resolvedComponent = resolveComponent(componentNameToResolve);
```

Component name must be the same as it was registered in the backed.

```ts{3}
Shopware.Service('cmsService').registerCmsElement({
    ...
    name: 'dailymotion',
    ...
});
```

Lets create new component `components/cms/element/CmsElementDailymotion.vue`

```vue
// components/cms/element/CmsElementDailymotion.vue
<script setup lang="ts">
import type { Schemas } from "#showpare";

type CmsElementDailymotion = Schemas["CmsSlot"] & {
  type: "dailymotion" | typeof String;
  slot: typeof String;
  config: CmsElementDailymotionConfig;
  translated: {
    config: CmsElementDailymotionConfig;
  };
};

type CmsElementDailymotionConfig = {
  dailyUrl: {
    value: string;
    source: "static";
  };
};
const props = defineProps<{
  content: CmsElementDailymotion;
}>();
</script>

<template>
  <div>
    <h2>Element!</h2>
    <div class="sw-cms-el-dailymotion">
      <div class="sw-cms-el-dailymotion-iframe-wrapper">
        <iframe
          frameborder="0"
          type="text/html"
          width="100%"
          height="100%"
          :src="props.content.config.dailyUrl.value"
        >
        </iframe>
      </div>
    </div>
  </div>
</template>
```

### Reading config

Component settings are passed via props. The declared `defaultConfig` can be accessed through the `props.content.config` property.

The following is an example of how to convert the backend registration config to a TypeScript type.

```ts{4-9}
Shopware.Service('cmsService').registerCmsElement({
  ...
    name: 'dailymotion',
    defaultConfig: {
        dailyUrl: {
            source: 'static',
            value: ''
        }
    }
  ...
});
```

```ts
type CmsElementDailymotionConfig = {
  dailyUrl: {
    value: string;
    source: "static";
  };
};
```
