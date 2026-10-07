---
head:
  - - meta
    - name: og:title
      content: Implement a Missing CMS Component
  - - meta
    - name: og:description
      content: "Step-by-step guide to implementing a CMS element or block that is missing from your Shopware Frontends project."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Missing%20CMS%20Component.png?fontSize=120px"
nav:
  position: 25
---

<script setup>
import { useRoute } from 'vitepress'
import { computed, ref, watch, onMounted } from 'vue'

const route = useRoute()

const rawSearch = ref('')
onMounted(() => { rawSearch.value = window.location.search })
watch(() => route.path, () => { rawSearch.value = window.location.search })

const params = computed(() => {
  const sp = new URLSearchParams(rawSearch.value)
  return {
    component: sp.get('component'),
    type: sp.get('type'),
  }
})

// Sanitize: only allow valid PascalCase component names (letters, numbers)
const componentName = computed(() => {
  const raw = params.value.component || ''
  const sanitized = raw.replace(/[^a-zA-Z0-9]/g, '')
  return sanitized && /^Cms[A-Z]/.test(sanitized) ? sanitized : 'CmsElementMyCustomSlider'
})
const cmsType = computed(() => {
  const allowed = ['element', 'block', 'section']
  return allowed.includes(params.value.type || '') ? params.value.type : 'element'
})
const hasContext = computed(() => !!params.value.component)

const schemaType = computed(() => {
  switch (cmsType.value) {
    case 'block': return 'CmsBlock'
    case 'section': return 'CmsSection'
    default: return 'CmsSlot'
  }
})
</script>

# Implement a Missing CMS Component

<div v-if="hasContext" class="custom-block tip">
  <p class="custom-block-title">Your missing component</p>
  <p>You need to create <strong>{{ componentName }}.vue</strong> ({{ cmsType }})</p>
</div>

You are here because a CMS {{ cmsType }} in your storefront has no matching Vue component. In development mode this shows as a highlighted placeholder instead of the actual content.

This page will take you from placeholder to working component in a few minutes.

## What is happening

The Shopware API returns a CMS tree of sections, blocks, and slots. Each node has a `type` field. The `cms-base-layer` package resolves a Vue component for each type by converting the name to PascalCase:

| API node      | `type` value       | expected component             |
| ------------- | ------------------ | ------------------------------ |
| `cms_section` | `sidebar`          | `CmsSectionSidebar.vue`        |
| `cms_block`   | `image-text`       | `CmsBlockImageText.vue`        |
| `cms_slot`    | `my-custom-slider` | `CmsElementMyCustomSlider.vue` |

For a custom element, `type` is the `name` it was registered with in the Administration, so `registerCmsElement({ name: "dailymotion" })` expects `CmsElementDailymotion.vue`.

If no matching block or element component exists, the placeholder appears in development, and the browser console logs a warning with the component name to create and a link to the docs. In production nothing renders, so a missing component fails silently. A missing section is the exception: `CmsPage` renders a plain "There is no …" line for it in every mode. Your job is to create the component.

## Is this a default Shopware CMS component?

The `@shopware/cms-base-layer` package ships implementations for all **default** Shopware 6 CMS blocks and elements. If you are seeing a placeholder for a type that ships with a standard Shopware 6 installation (not a custom plugin or your own block), this is a missing implementation in the package itself.

::: warning Missing a default component?
If the component type is part of **core Shopware 6 CMS** and is not covered by `cms-base-layer`, please open an issue so we can add it:

👉 [Create an issue on GitHub](https://github.com/shopware/frontends/issues/new?labels=cms-base)

Add the **`cms-base`** label to the issue. Include the component name shown in the placeholder, the `type` value, and the `apiAlias` from the API response. You can copy the full content JSON from the **copy AI prompt** button in the placeholder.
:::

If the component belongs to a custom plugin or you created the block yourself in the Shopware backend, continue with the steps below. The backend side of a custom element is described in [Add custom CMS element](https://developer.shopware.com/docs/guides/plugins/plugins/content/cms/add-cms-element.html).

## Step 1 — Create the file

<div v-if="hasContext" class="custom-block tip">
  <p class="custom-block-title">Your component</p>
  <p>Create <code>app/components/cms/{{ componentName }}.vue</code></p>
</div>

Create the file under your template’s global CMS components dir (e.g. `app/components/cms/`), which templates register with `global: true` so `resolveComponent` can find it:

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/cms/missing-component/step-1-create-the-file" code no-name -->

```
your-project/
└── app/
    └── components/
        └── cms/
            └── {{ componentName }}.vue   ← create this
```

<!-- /automd -->

## Step 2 — Define the props

Every CMS component receives a single `content` prop. Use the Shopware schema type matching the CMS node type:

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/cms/missing-component/step-2-define-the-props.vue" code lang="vue" no-name -->

```vue
<!-- app/components/cms/{{ componentName }}.vue -->
<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: Schemas["CmsBlock"];
}>();
</script>
```

<!-- /automd -->

For an element with its own settings, type `config` from the `defaultConfig` it was registered with. The backend guide registers its `dailymotion` element like this:

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/cms/missing-component/step-2-define-the-props-2.ts" code lang="ts" no-name -->

```ts
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

Each key of `defaultConfig` arrives in `content.config` as an `ElementConfig` holding `source` and `value`, which is how the element example in Step 3 types its `config`.

## Step 3 — Render the content

The `content` prop contains everything the API returned for that node. The exact fields depend on your CMS configuration in Shopware, but the structure is always:

- **`content.config`** — editor-configured settings (alignment, display mode, etc.)
- **`content.data`** — resolved data (media objects, products, etc.)
- **`content.translated`** — translated field values

Use the **copy AI prompt** button on the placeholder to get a pre-filled prompt that includes the full `content` JSON for your specific {{ cmsType }} — paste it into any AI assistant to generate a working first draft.

A minimal working {{ cmsType }}:

<div v-if="cmsType === 'block'">

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/cms/missing-component/step-3-render-the-content.vue" code lang="vue" no-name -->

```vue
<!-- app/components/cms/{{ componentName }}.vue -->
<script setup lang="ts">
import { computed, useCmsBlock } from "#imports";
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: Schemas["CmsBlock"];
}>();

const { getSlotContent } = useCmsBlock(() => props.content);
const mainContent = computed(() => getSlotContent("main"));
</script>

<template>
  <div>
    <CmsGenericElement :content="mainContent" />
  </div>
</template>
```

<!-- /automd -->

</div>

<div v-else>

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/cms/missing-component/step-3-render-the-content-2.vue" code lang="vue" no-name -->

```vue
<!-- app/components/cms/{{ componentName }}.vue -->
<script setup lang="ts">
import type { ElementConfig } from "@shopware/composables";

import { computed, useCmsElementConfig } from "#imports";
import type { Schemas } from "#shopware";

type CmsElementMyCustomSlider = Omit<Schemas["CmsSlot"], "config"> & {
  config: {
    title?: ElementConfig<string>;
  };
};

const props = defineProps<{
  content: CmsElementMyCustomSlider;
}>();

const { getConfigValue } = useCmsElementConfig(props.content);
const title = computed(() => getConfigValue("title") || "");
</script>

<template>
  <div>
    <h2 v-if="title">{{ title }}</h2>
  </div>
</template>
```

<!-- /automd -->

Read the settings through `getConfigValue` rather than from `content.config` directly. It returns `false` for an entry whose `source` is `mapped`, because a mapped value comes from the surrounding entity, not from the element.

</div>

## Step 4 — Verify

Save the file. Vite will hot-reload and the placeholder will be replaced by your component. If it still shows, check that:

- the filename exactly matches the expected component name (PascalCase, `.vue` extension)
- the file is inside a directory your `nuxt.config.ts` registers with `global: true` — `app/components/cms/` in `vue-starter-template`. A file in plain `app/components/` is auto-imported but not global, so `resolveComponent` does not find it.

::: tip No restart needed
Nuxt's component auto-import picks up new files without restarting the dev server.
:::

Outside Nuxt nothing registers the file for you. Register the component globally, because `resolveComponent` only sees global components:

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/cms/missing-component/step-4-verify.ts" code lang="ts" no-name -->

```ts
import { createApp } from "vue";

import CmsElementDailymotion from "./components/cms/CmsElementDailymotion.vue";

const app = createApp({});
app.component("CmsElementDailymotion", CmsElementDailymotion);
```

<!-- /automd -->

## Going deeper

<PageRef page="create-elements.html" title="Create Elements" sub="Typed composables and helpers for working with CMS element data." />
<PageRef page="create-blocks.html" title="Create Blocks" sub="How to build block layouts with named slots." />
<PageRef page="overwriting-cms.html" title="Customize existing components" sub="Override a default component from cms-base-layer." />
<PageRef page="../../frontends-recipes/cms/rendering.html" title="Rendering CMS Pages" sub="How the CMS tree in the API response is resolved to components." />
