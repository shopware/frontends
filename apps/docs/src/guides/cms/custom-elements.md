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

Templates register `app/components/cms/` as a Nuxt **global** component directory so Vue `resolveComponent` can find CMS blocks and elements. Put custom CMS components there (not only under a non-global `components/` path).

### Vue apps

[Global registration](https://vuejs.org/guide/components/registration#global-registration) in Vue apps

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/cms/custom-elements/vue-apps.ts" code lang="ts" no-name -->

```ts
import { createApp } from "vue";

import CmsBlockCustomBlock from "./components/cms/CmsElementDailymotion.vue";

const app = createApp({});
app.component("CmsElementDailymotion", CmsBlockCustomBlock);
```

<!-- /automd -->

## Naming

The component is searched in the global component register by its name.

[Resolving component in CMS package](https://github.com/shopware/frontends/blob/main/packages/composables/src/index.ts#L74)

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/cms/custom-elements/naming.js" code lang="js" no-name -->

```js
const componentNameToResolve = pascalCase(`Cms-${type}-${componentName}`);
const resolvedComponent = resolveComponent(componentNameToResolve);
```

<!-- /automd -->

Component name must be the same as it was registered in the backed.

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/cms/custom-elements/naming.ts" code lang="ts{3}" no-name -->

```ts{3}
type CmsElementRegistration = {
  name: string;
};

declare const Shopware: {
  Service(service: "cmsService"): {
    registerCmsElement(config: CmsElementRegistration): void;
  };
};

Shopware.Service("cmsService").registerCmsElement({
  name: "dailymotion",
});
```

<!-- /automd -->

Lets create new component `components/cms/element/CmsElementDailymotion.vue`

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/cms/custom-elements/naming.vue" code lang="vue" no-name -->

```vue
// components/cms/element/CmsElementDailymotion.vue
<script setup lang="ts">
import type { Schemas } from "#shopware";

type CmsElementDailymotion = Schemas["CmsSlot"] & {
  type: "dailymotion" | typeof String;
  slot: string;
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

<!-- /automd -->

### Reading config

Component settings are passed via props. The declared `defaultConfig` can be accessed through the `props.content.config` property.

The following is an example of how to convert the backend registration config to a TypeScript type.

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/cms/custom-elements/reading-config.ts" code lang="ts{4-9}" no-name -->

```ts{4-9}
type CmsElementRegistration = {
  name: string;
  defaultConfig: {
    dailyUrl: {
      source: "static";
      value: string;
    };
  };
};

declare const Shopware: {
  Service(service: "cmsService"): {
    registerCmsElement(config: CmsElementRegistration): void;
  };
};

Shopware.Service("cmsService").registerCmsElement({
  name: "dailymotion",
  defaultConfig: {
    dailyUrl: {
      source: "static",
      value: "",
    },
  },
});
```

<!-- /automd -->

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/cms/custom-elements/reading-config-2.ts" code lang="ts" no-name -->

```ts
type CmsElementDailymotionConfig = {
  dailyUrl: {
    value: string;
    source: "static";
  };
};
```

<!-- /automd -->
